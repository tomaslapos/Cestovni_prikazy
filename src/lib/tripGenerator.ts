import { Distance } from '../types';

// České státní svátky
function getCzechHolidays(year: number): Set<string> {
  const holidays = new Set<string>();
  
  // Pevné svátky
  holidays.add(`${year}-01-01`); // Nový rok
  holidays.add(`${year}-05-01`); // Svátek práce
  holidays.add(`${year}-05-08`); // Den vítězství
  holidays.add(`${year}-07-05`); // Cyril a Metoděj
  holidays.add(`${year}-07-06`); // Jan Hus
  holidays.add(`${year}-09-28`); // Den české státnosti
  holidays.add(`${year}-10-28`); // Vznik Československa
  holidays.add(`${year}-11-17`); // Den boje za svobodu
  holidays.add(`${year}-12-24`); // Štědrý den
  holidays.add(`${year}-12-25`); // 1. svátek vánoční
  holidays.add(`${year}-12-26`); // 2. svátek vánoční

  // Velikonoční pondělí (pohyblivý svátek)
  const easter = getEasterMonday(year);
  holidays.add(easter);
  
  // Velký pátek (od 2016)
  const easterDate = new Date(easter);
  easterDate.setDate(easterDate.getDate() - 3);
  holidays.add(formatDate(easterDate));

  return holidays;
}

function getEasterMonday(year: number): string {
  // Meeus/Jones/Butcher algorithm for Easter Sunday
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  // Easter Monday = Easter Sunday + 1
  const easterSunday = new Date(year, month - 1, day);
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterMonday.getDate() + 1);
  
  return formatDate(easterMonday);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isWorkday(date: Date, holidays: Set<string>): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; // víkend
  if (holidays.has(formatDate(date))) return false; // svátek
  return true;
}

function getWorkdays(dateFrom: Date, dateTo: Date): Date[] {
  const workdays: Date[] = [];
  const years = new Set<number>();
  
  const current = new Date(dateFrom);
  const end = new Date(dateTo);
  
  // Collect years in range
  while (current <= end) {
    years.add(current.getFullYear());
    current.setDate(current.getDate() + 1);
  }
  
  // Build holidays set for all years
  const holidays = new Set<string>();
  years.forEach((year) => {
    getCzechHolidays(year).forEach((h) => holidays.add(h));
  });
  
  // Collect workdays
  const cur = new Date(dateFrom);
  while (cur <= end) {
    if (isWorkday(cur, holidays)) {
      workdays.push(new Date(cur));
    }
    cur.setDate(cur.getDate() + 1);
  }
  
  return workdays;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomTime(baseHour: number, baseMinute: number, varianceMinutes: number): { hour: number; minute: number } {
  const totalMinutes = baseHour * 60 + baseMinute + randomBetween(-varianceMinutes, varianceMinutes);
  const hour = Math.max(6, Math.min(20, Math.floor(totalMinutes / 60)));
  const minute = Math.max(0, Math.min(59, totalMinutes % 60));
  return { hour, minute };
}

export interface GeneratedTrip {
  vehicle_id: string;
  driver_name: string;
  start_date: string;
  end_date: string;
  purpose: string;
  start_location: string;
  end_location: string;
  start_km: number;
  end_km: number;
  distance: number;
}

export interface GenerationResult {
  trips: GeneratedTrip[];
  totalGeneratedKm: number;
}

export function generateTrips(
  vehicleId: string,
  driverName: string,
  dateFrom: Date,
  dateTo: Date,
  targetKm: number,
  currentVehicleKm: number,
  distances: Distance[]
): GenerationResult {
  const workdays = getWorkdays(dateFrom, dateTo);
  
  if (workdays.length === 0) {
    return { trips: [], totalGeneratedKm: 0 };
  }

  // Filter distances from Ústí nad Labem that make sense (not too far for a day trip)
  const availableDestinations = distances.filter(
    (d) => d.start_city === 'Ústí nad Labem' && d.distance_km >= 5 && d.distance_km <= 200
  );

  if (availableDestinations.length === 0) {
    return { trips: [], totalGeneratedKm: 0 };
  }

  // Target is total km for the period - each trip is a round trip (there + back = 2x distance)
  const targetTotalKm = targetKm;
  
  // Strategy: pick random workdays and random destinations, trying to match target km
  // Each "trip" creates 2 records: there and back
  const trips: GeneratedTrip[] = [];
  let totalKm = 0;
  let runningKm = currentVehicleKm;

  // Determine how many trip days we need (rough estimate)
  // Average round trip ~80-120km, so estimate days needed
  const avgRoundTrip = 100;
  const estimatedDays = Math.max(1, Math.ceil(targetTotalKm / avgRoundTrip));
  
  // Pick random workdays (up to estimated days, but not more than available)
  const tripDaysCount = Math.min(estimatedDays, workdays.length);
  
  // Shuffle workdays and pick first N
  const shuffledWorkdays = [...workdays].sort(() => Math.random() - 0.5);
  const selectedDays = shuffledWorkdays.slice(0, tripDaysCount).sort((a, b) => a.getTime() - b.getTime());

  // Distribute km across selected days
  // First pass: assign trips to get close to target
  for (let i = 0; i < selectedDays.length; i++) {
    const remaining = targetTotalKm - totalKm;
    if (remaining <= 0) break;

    const daysLeft = selectedDays.length - i;
    const targetForDay = remaining / daysLeft;

    // Find a destination where round trip is close to targetForDay
    // Round trip = 2 * one-way distance
    const targetOneWay = targetForDay / 2;

    // Sort destinations by how close their distance is to target
    const sorted = [...availableDestinations].sort(
      (a, b) => Math.abs(a.distance_km - targetOneWay) - Math.abs(b.distance_km - targetOneWay)
    );

    // Pick from top 5 closest to add variety
    const candidates = sorted.slice(0, Math.min(5, sorted.length));
    const chosen = candidates[randomBetween(0, candidates.length - 1)];
    const oneWayKm = chosen.distance_km;
    const roundTripKm = oneWayKm * 2;

    const day = selectedDays[i];

    // Generate departure time (roughly 7:30-9:30)
    const departure = generateRandomTime(8, 30, 60);
    // Generate arrival at destination (departure + travel time estimate)
    const travelHours = Math.max(0.5, oneWayKm / 80); // ~80 km/h average
    const arrivalMinutes = departure.hour * 60 + departure.minute + Math.round(travelHours * 60) + randomBetween(10, 40);
    const arrivalHour = Math.min(12, Math.floor(arrivalMinutes / 60));
    const arrivalMin = arrivalMinutes % 60;

    // Return trip starts in afternoon (13:00-16:00)
    const returnDeparture = generateRandomTime(14, 0, 60);
    const returnArrivalMinutes = returnDeparture.hour * 60 + returnDeparture.minute + Math.round(travelHours * 60) + randomBetween(10, 40);
    const returnArrivalHour = Math.min(20, Math.floor(returnArrivalMinutes / 60));
    const returnArrivalMin = Math.min(59, returnArrivalMinutes % 60);

    // Trip 1: Ústí nad Labem -> Destination
    const startDate1 = new Date(day);
    startDate1.setHours(departure.hour, departure.minute, 0, 0);
    
    const endDate1 = new Date(day);
    endDate1.setHours(arrivalHour, arrivalMin, 0, 0);

    trips.push({
      vehicle_id: vehicleId,
      driver_name: driverName,
      start_date: startDate1.toISOString(),
      end_date: endDate1.toISOString(),
      purpose: 'služební',
      start_location: 'Ústí nad Labem',
      end_location: chosen.end_city,
      start_km: runningKm,
      end_km: runningKm + oneWayKm,
      distance: oneWayKm,
    });

    runningKm += oneWayKm;

    // Trip 2: Destination -> Ústí nad Labem
    const startDate2 = new Date(day);
    startDate2.setHours(returnDeparture.hour, returnDeparture.minute, 0, 0);
    
    const endDate2 = new Date(day);
    endDate2.setHours(returnArrivalHour, returnArrivalMin, 0, 0);

    trips.push({
      vehicle_id: vehicleId,
      driver_name: driverName,
      start_date: startDate2.toISOString(),
      end_date: endDate2.toISOString(),
      purpose: 'služební',
      start_location: chosen.end_city,
      end_location: 'Ústí nad Labem',
      start_km: runningKm,
      end_km: runningKm + oneWayKm,
      distance: oneWayKm,
    });

    runningKm += oneWayKm;
    totalKm += roundTripKm;
  }

  // Fine-tuning: if we're too far off, add or adjust trips
  const deviation = Math.abs(totalKm - targetTotalKm) / targetTotalKm;
  
  if (deviation > 0.03 && totalKm < targetTotalKm) {
    // Need more km - add extra trips on unused workdays
    const usedDays = new Set(selectedDays.map((d) => formatDate(d)));
    const unusedWorkdays = workdays.filter((d) => !usedDays.has(formatDate(d)));
    
    for (const day of unusedWorkdays) {
      const remaining = targetTotalKm - totalKm;
      if (remaining <= 5) break;
      if (Math.abs(totalKm - targetTotalKm) / targetTotalKm <= 0.03) break;

      const targetOneWay = remaining / 2;
      const sorted = [...availableDestinations].sort(
        (a, b) => Math.abs(a.distance_km - targetOneWay) - Math.abs(b.distance_km - targetOneWay)
      );
      const chosen = sorted[0];
      const oneWayKm = chosen.distance_km;
      const travelHours = Math.max(0.5, oneWayKm / 80);

      const departure = generateRandomTime(8, 30, 60);
      const arrivalMinutes = departure.hour * 60 + departure.minute + Math.round(travelHours * 60) + randomBetween(10, 40);
      const arrivalHour = Math.min(12, Math.floor(arrivalMinutes / 60));
      const arrivalMin = arrivalMinutes % 60;

      const returnDeparture = generateRandomTime(14, 0, 60);
      const returnArrivalMinutes = returnDeparture.hour * 60 + returnDeparture.minute + Math.round(travelHours * 60) + randomBetween(10, 40);
      const returnArrivalHour = Math.min(20, Math.floor(returnArrivalMinutes / 60));
      const returnArrivalMin = Math.min(59, returnArrivalMinutes % 60);

      const startDate1 = new Date(day);
      startDate1.setHours(departure.hour, departure.minute, 0, 0);
      const endDate1 = new Date(day);
      endDate1.setHours(arrivalHour, arrivalMin, 0, 0);

      trips.push({
        vehicle_id: vehicleId,
        driver_name: driverName,
        start_date: startDate1.toISOString(),
        end_date: endDate1.toISOString(),
        purpose: 'služební',
        start_location: 'Ústí nad Labem',
        end_location: chosen.end_city,
        start_km: runningKm,
        end_km: runningKm + oneWayKm,
        distance: oneWayKm,
      });
      runningKm += oneWayKm;

      const startDate2 = new Date(day);
      startDate2.setHours(returnDeparture.hour, returnDeparture.minute, 0, 0);
      const endDate2 = new Date(day);
      endDate2.setHours(returnArrivalHour, returnArrivalMin, 0, 0);

      trips.push({
        vehicle_id: vehicleId,
        driver_name: driverName,
        start_date: startDate2.toISOString(),
        end_date: endDate2.toISOString(),
        purpose: 'služební',
        start_location: chosen.end_city,
        end_location: 'Ústí nad Labem',
        start_km: runningKm,
        end_km: runningKm + oneWayKm,
        distance: oneWayKm,
      });
      runningKm += oneWayKm;
      totalKm += oneWayKm * 2;
    }
  }

  // Sort all trips by date
  trips.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  // Recalculate running km after sorting
  let km = currentVehicleKm;
  for (const trip of trips) {
    trip.start_km = km;
    trip.end_km = km + trip.distance;
    km = trip.end_km;
  }

  return {
    trips,
    totalGeneratedKm: totalKm,
  };
}

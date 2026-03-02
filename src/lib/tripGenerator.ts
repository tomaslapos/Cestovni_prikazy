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

// Přidá -5% až +15% k navigačnímu času jízdy (zdržení na cestě, provoz, zastávky)
// Reálně je cesta téměř vždy delší než navigace, jen výjimečně kratší
function addTravelTimeBuffer(baseMinutes: number): number {
  const bufferPercent = -0.05 + Math.random() * 0.20; // -5% to +15%
  return Math.round(baseMinutes * (1 + bufferPercent));
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

function createTripPair(
  vehicleId: string,
  driverName: string,
  day: Date,
  destination: Distance,
): GeneratedTrip[] {
  const oneWayKm = destination.distance_km;
  const baseTravelMin = destination.travel_time_min;
  
  // Čas jízdy tam s 5-15% navýšením
  const travelMinThere = addTravelTimeBuffer(baseTravelMin);
  // Čas jízdy zpět s 5-15% navýšením (nezávisle)
  const travelMinBack = addTravelTimeBuffer(baseTravelMin);

  // Odjezd ráno (7:30-9:30)
  const departure = generateRandomTime(8, 30, 60);
  const depMinutes = departure.hour * 60 + departure.minute;
  
  // Příjezd do cíle
  const arrMinutes = depMinutes + travelMinThere;
  const arrHour = Math.min(18, Math.floor(arrMinutes / 60));
  const arrMin = arrMinutes % 60;

  // Pauza v cíli: 1-3 hodiny
  const breakMin = 60 + Math.floor(Math.random() * 120);
  
  // Odjezd zpět
  const retDepMinutes = arrMinutes + breakMin;
  const retDepHour = Math.min(19, Math.floor(retDepMinutes / 60));
  const retDepMin = retDepMinutes % 60;
  
  // Příjezd zpět
  const retArrMinutes = retDepMinutes + travelMinBack;
  const retArrHour = Math.min(22, Math.floor(retArrMinutes / 60));
  const retArrMin = Math.min(59, retArrMinutes % 60);

  const startDate1 = new Date(day);
  startDate1.setHours(departure.hour, departure.minute, 0, 0);
  const endDate1 = new Date(day);
  endDate1.setHours(arrHour, arrMin, 0, 0);

  const startDate2 = new Date(day);
  startDate2.setHours(retDepHour, retDepMin, 0, 0);
  const endDate2 = new Date(day);
  endDate2.setHours(retArrHour, retArrMin, 0, 0);

  return [
    {
      vehicle_id: vehicleId,
      driver_name: driverName,
      start_date: startDate1.toISOString(),
      end_date: endDate1.toISOString(),
      purpose: 'služební',
      start_location: 'Ústí nad Labem',
      end_location: destination.end_city,
      start_km: 0, // bude přepočítáno
      end_km: oneWayKm,
      distance: oneWayKm,
    },
    {
      vehicle_id: vehicleId,
      driver_name: driverName,
      start_date: startDate2.toISOString(),
      end_date: endDate2.toISOString(),
      purpose: 'služební',
      start_location: destination.end_city,
      end_location: 'Ústí nad Labem',
      start_km: 0,
      end_km: oneWayKm,
      distance: oneWayKm,
    },
  ];
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

  // Destinace z Ústí nad Labem - krátké/střední (do 150 km jednosměrně)
  const shortDestinations = distances.filter(
    (d) => d.start_city === 'Ústí nad Labem' && d.distance_km >= 15 && d.distance_km <= 150
  );
  // Praha specificky pro povinné cesty každých ~500 km
  const pragueTrip = distances.find(
    (d) => d.start_city === 'Ústí nad Labem' && d.end_city === 'Praha'
  );

  if (shortDestinations.length === 0) {
    return { trips: [], totalGeneratedKm: 0 };
  }

  const targetTotalKm = targetKm;
  const trips: GeneratedTrip[] = [];
  let totalKm = 0;

  // Strategie: cesty ne každý den, spíše ob den nebo ob dva dny
  // Delší cesty (Praha) každých ~500 km
  // Rozestup: průměrně ob 2-3 dny

  // Spočítej kolik "Praha" cest potřebujeme (každých ~500 km)
  const pragueRoundTrip = pragueTrip ? pragueTrip.distance_km * 2 : 186;
  const pragueTripsCount = Math.max(0, Math.floor(targetTotalKm / 500));
  
  // Zbývající km po pražských cestách
  const kmFromPrague = pragueTripsCount * pragueRoundTrip;
  const remainingKm = targetTotalKm - kmFromPrague;
  
  // Průměrná kratší cesta tam a zpět ~60-120 km
  const avgShortRoundTrip = 90;
  const shortTripsNeeded = Math.max(0, Math.ceil(remainingKm / avgShortRoundTrip));
  
  const totalTripsNeeded = pragueTripsCount + shortTripsNeeded;

  // Vyber pracovní dny s rozestupy (ob 2-3 dny)
  const selectedDays: Date[] = [];
  let dayIndex = 0;
  while (selectedDays.length < totalTripsNeeded && dayIndex < workdays.length) {
    selectedDays.push(workdays[dayIndex]);
    // Přeskoč 1-3 pracovní dny (= cesty ob den až ob tři dny)
    const skip = randomBetween(1, 3);
    dayIndex += 1 + skip;
  }

  // Pokud nemáme dost dní, doplň zbývající pracovní dny
  if (selectedDays.length < totalTripsNeeded) {
    const usedSet = new Set(selectedDays.map((d) => formatDate(d)));
    for (const wd of workdays) {
      if (selectedDays.length >= totalTripsNeeded) break;
      if (!usedSet.has(formatDate(wd))) {
        selectedDays.push(wd);
        usedSet.add(formatDate(wd));
      }
    }
    selectedDays.sort((a, b) => a.getTime() - b.getTime());
  }

  // Rozvrh: rovnoměrně rozlož pražské cesty
  const pragueIndices = new Set<number>();
  if (pragueTripsCount > 0 && selectedDays.length > 0) {
    const spacing = Math.floor(selectedDays.length / (pragueTripsCount + 1));
    for (let p = 0; p < pragueTripsCount; p++) {
      const idx = Math.min(spacing * (p + 1), selectedDays.length - 1);
      pragueIndices.add(idx);
    }
  }

  // Generuj cesty
  for (let i = 0; i < selectedDays.length; i++) {
    const remaining = targetTotalKm - totalKm;
    if (remaining <= 5) break;

    const day = selectedDays[i];
    let chosen: Distance;

    if (pragueIndices.has(i) && pragueTrip) {
      // Pražská cesta
      chosen = pragueTrip;
    } else {
      // Vyber kratší destinaci podle zbývajících km
      const daysLeft = selectedDays.length - i - pragueIndices.size + [...pragueIndices].filter((pi) => pi <= i).length;
      const remainingForShort = remaining - ([...pragueIndices].filter((pi) => pi > i).length * pragueRoundTrip);
      const targetOneWay = Math.max(15, (remainingForShort > 0 ? remainingForShort : remaining) / Math.max(1, daysLeft) / 2);

      // Seřaď podle blízkosti k cílovým km
      const sorted = [...shortDestinations].sort(
        (a, b) => Math.abs(a.distance_km - targetOneWay) - Math.abs(b.distance_km - targetOneWay)
      );

      // Vyber z top 5 kandidátů pro pestrost
      const candidates = sorted.slice(0, Math.min(5, sorted.length));
      chosen = candidates[randomBetween(0, candidates.length - 1)];
    }

    const tripPair = createTripPair(vehicleId, driverName, day, chosen);
    trips.push(...tripPair);
    totalKm += chosen.distance_km * 2;
  }

  // Doladění: pokud jsme daleko od cíle, přidej cesty na nevyužité dny
  if (totalKm < targetTotalKm * 0.97) {
    const usedDays = new Set(selectedDays.map((d) => formatDate(d)));
    const unusedWorkdays = workdays.filter((d) => !usedDays.has(formatDate(d)));
    
    for (const day of unusedWorkdays) {
      const remaining = targetTotalKm - totalKm;
      if (remaining <= 5) break;
      if (totalKm >= targetTotalKm * 0.97) break;

      const targetOneWay = Math.max(15, remaining / 2);
      const sorted = [...shortDestinations].sort(
        (a, b) => Math.abs(a.distance_km - targetOneWay) - Math.abs(b.distance_km - targetOneWay)
      );
      const chosen = sorted[0];

      const tripPair = createTripPair(vehicleId, driverName, day, chosen);
      trips.push(...tripPair);
      totalKm += chosen.distance_km * 2;
    }
  }

  // Seřaď všechny cesty chronologicky
  trips.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  // Přepočítej km (running odometer)
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

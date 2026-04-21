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

// Zamíchej pole (Fisher-Yates shuffle)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomBetween(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

  // Destinace z Ústí nad Labem (15–400 km jednosměrně)
  const allDestinations = distances.filter(
    (d) => d.start_city === 'Ústí nad Labem' && d.distance_km >= 15 && d.distance_km <= 400
  );

  if (allDestinations.length === 0) {
    return { trips: [], totalGeneratedKm: 0 };
  }

  // Pojmenované destinace
  const pragueTrip = distances.find(
    (d) => d.start_city === 'Ústí nad Labem' && d.end_city === 'Praha'
  );
  const brnoTrip = distances.find(
    (d) => d.start_city === 'Ústí nad Labem' && d.end_city === 'Brno'
  );
  const ostravaTrip = distances.find(
    (d) => d.start_city === 'Ústí nad Labem' && d.end_city === 'Ostrava'
  );

  const targetTotalKm = targetKm;
  const trips: GeneratedTrip[] = [];
  let totalKm = 0;

  // --- 1. Spočítej období v měsících ---
  const periodDays = Math.max(1, Math.round((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)));
  const periodMonths = Math.max(1, Math.round(periodDays / 30));
  const monthlyKm = targetTotalKm / periodMonths;

  // --- 2. Povinné cesty: Praha 2×/měsíc, Brno a Ostrava 1×/měsíc při ≥3000 km ---
  const forcedList: Distance[] = [];
  if (pragueTrip) {
    for (let i = 0; i < periodMonths * 2; i++) forcedList.push(pragueTrip);
  }
  if (brnoTrip && monthlyKm >= 3000) {
    for (let i = 0; i < periodMonths; i++) forcedList.push(brnoTrip);
  }
  if (ostravaTrip && monthlyKm >= 3000) {
    for (let i = 0; i < periodMonths; i++) forcedList.push(ostravaTrip);
  }

  // Vyloučit Praha/Brno/Ostrava z běžného poolu (ty jsou v povinných)
  const forcedCities = new Set(['Praha', 'Brno', 'Ostrava']);
  const regularPool = allDestinations.filter((d) => !forcedCities.has(d.end_city));
  const destPool = regularPool.length >= 5 ? regularPool : allDestinations;

  // --- 3. Spočítej potřebný počet jízd ---
  const kmFromForced = forcedList.reduce((sum, d) => sum + d.distance_km * 2, 0);
  const remainingKm = Math.max(0, targetTotalKm - kmFromForced);
  // Průměr round-trip z CELÉHO poolu (reálný průměr toho co vybíráme)
  const avgRoundTrip = Math.round(
    (destPool.reduce((sum, d) => sum + d.distance_km, 0) / destPool.length) * 2
  );
  const regularTripsNeeded = Math.max(0, Math.ceil(remainingKm / avgRoundTrip));
  const totalTripsNeeded = forcedList.length + regularTripsNeeded;

  // --- 4. Rozlož jízdy rovnoměrně přes celé období ---
  // Vyber totalTripsNeeded indexů rovnoměrně rozložených přes workdays s jitterem
  const selectedDays: Date[] = [];
  if (totalTripsNeeded >= workdays.length) {
    // Potřebujeme víc jízd než dní – použij všechny
    selectedDays.push(...workdays);
  } else {
    // Rovnoměrně rozlož: pro každou jízdu spočítej ideální pozici v poli
    for (let t = 0; t < totalTripsNeeded; t++) {
      const idealIndex = Math.round((t / totalTripsNeeded) * workdays.length);
      // Přidej náhodný jitter ±1, ale drž v mezích
      const jitter = randomBetween(-1, 1);
      const idx = Math.max(0, Math.min(workdays.length - 1, idealIndex + jitter));
      selectedDays.push(workdays[idx]);
    }
    // Odstraň duplikáty a seřaď
    const unique = new Map<string, Date>();
    for (const d of selectedDays) {
      unique.set(formatDate(d), d);
    }
    selectedDays.length = 0;
    selectedDays.push(...Array.from(unique.values()).sort((a, b) => a.getTime() - b.getTime()));
  }

  // --- 5. Přiřaď povinné cesty rovnoměrně přes vybrané dny ---
  const forcedIndices = new Map<number, Distance>();
  if (forcedList.length > 0 && selectedDays.length > 0) {
    const spacing = Math.max(1, Math.floor(selectedDays.length / (forcedList.length + 1)));
    const shuffledForced = shuffle(forcedList);
    for (let p = 0; p < shuffledForced.length; p++) {
      const idx = Math.min(spacing * (p + 1), selectedDays.length - 1);
      let finalIdx = idx;
      while (forcedIndices.has(finalIdx) && finalIdx < selectedDays.length - 1) finalIdx++;
      if (!forcedIndices.has(finalIdx)) {
        forcedIndices.set(finalIdx, shuffledForced[p]);
      }
    }
  }

  // --- 6. Spočítej ideální round-trip pro běžné jízdy ---
  const regularDays = Math.max(1, selectedDays.length - forcedList.length);
  const idealOneWay = Math.round(remainingKm / regularDays / 2);
  // Vyber destinace blízké ideálu (±40%), fallback na celý pool
  const nearDest = destPool.filter(
    (d) => d.distance_km >= idealOneWay * 0.6 && d.distance_km <= idealOneWay * 1.4
  );
  const preferredPool = nearDest.length >= 5 ? nearDest : destPool;

  // --- 7. Generuj cesty na vybrané dny ---
  let lastCity = '';
  for (let i = 0; i < selectedDays.length; i++) {
    const remaining = targetTotalKm - totalKm;
    if (remaining <= 5) break;

    const day = selectedDays[i];
    let chosen: Distance;

    if (forcedIndices.has(i)) {
      chosen = forcedIndices.get(i)!;
    } else {
      // Vyber z preferovaného poolu, bez opakování za sebou
      let attempts = 0;
      do {
        chosen = preferredPool[randomBetween(0, preferredPool.length - 1)];
        attempts++;
      } while (chosen.end_city === lastCity && attempts < 10);

      // Pokud zbývá málo km, vyber kratší destinaci
      if (remaining < chosen.distance_km * 2) {
        const shorter = destPool.filter((d) => d.distance_km * 2 <= remaining + 10);
        if (shorter.length > 0) {
          chosen = shorter[randomBetween(0, shorter.length - 1)];
        }
      }
    }

    lastCity = chosen.end_city;
    const tripPair = createTripPair(vehicleId, driverName, day, chosen);
    trips.push(...tripPair);
    totalKm += chosen.distance_km * 2;
  }

  // --- 8. Dorovnání: pokud jsme pod cílem (> 3% odchylka), doplň jízdy ---
  if (totalKm < targetTotalKm * 0.97) {
    const usedDays = new Set(trips.map((t) => t.start_date.slice(0, 10)));
    // Najdi nevyužité pracovní dny ROVNOMĚRNĚ mezi posledními jízdami
    const unusedWorkdays = workdays.filter((d) => !usedDays.has(formatDate(d)));
    const deficit = targetTotalKm - totalKm;
    const shortPool = destPool.filter((d) => d.distance_km * 2 <= deficit + 10);
    const fillPool = shortPool.length >= 3 ? shortPool : destPool;
    // Vyber dny rovnoměrně z nevyužitých
    const fillNeeded = Math.max(1, Math.ceil(deficit / avgRoundTrip));
    const fillSpacing = Math.max(1, Math.floor(unusedWorkdays.length / (fillNeeded + 1)));
    for (let f = 0; f < fillNeeded && f * fillSpacing < unusedWorkdays.length; f++) {
      const rem = targetTotalKm - totalKm;
      if (rem <= 5) break;
      const day = unusedWorkdays[Math.min(f * fillSpacing, unusedWorkdays.length - 1)];
      let chosen: Distance;
      const shorter = fillPool.filter((d) => d.distance_km * 2 <= rem + 10);
      const pool = shorter.length >= 3 ? shorter : fillPool;
      let att = 0;
      do {
        chosen = pool[randomBetween(0, pool.length - 1)];
        att++;
      } while (chosen.end_city === lastCity && att < 10);
      lastCity = chosen.end_city;
      trips.push(...createTripPair(vehicleId, driverName, day, chosen));
      totalKm += chosen.distance_km * 2;
    }
  }

  // --- 9. Seřaď chronologicky a přepočítej km ---
  trips.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

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

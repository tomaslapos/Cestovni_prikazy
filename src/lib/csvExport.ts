import { Trip } from '../types';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

export function exportTripsToCSV(trips: Trip[], filename: string = 'jizdy'): void {
  const headers = [
    'Datum začátku',
    'Datum konce',
    'Vozidlo',
    'SPZ',
    'Řidič',
    'Účel',
    'Začátek cesty',
    'Cíl cesty',
    'Počáteční stav km',
    'Konečný stav km',
    'Najeto km',
  ];

  const rows = trips.map((trip) => [
    format(new Date(trip.start_date), 'dd.MM.yyyy HH:mm', { locale: cs }),
    format(new Date(trip.end_date), 'dd.MM.yyyy HH:mm', { locale: cs }),
    trip.vehicle?.name || '',
    trip.vehicle?.spz || '',
    trip.driver_name,
    trip.purpose,
    trip.start_location,
    trip.end_location,
    trip.start_km.toString(),
    trip.end_km.toString(),
    trip.distance.toString(),
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';')),
  ].join('\n');

  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

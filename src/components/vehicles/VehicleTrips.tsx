import { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { MapPin, Calendar, User, Gauge, Search } from 'lucide-react';
import { Trip } from '../../types';

interface VehicleTripsProps {
  trips: Trip[];
  loading: boolean;
  onTripClick: (trip: Trip) => void;
}

export function VehicleTrips({ trips, loading, onTripClick }: VehicleTripsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState<string>('');

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.start_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.end_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth = filterMonth
      ? format(new Date(trip.start_date), 'yyyy-MM') === filterMonth
      : true;

    return matchesSearch && matchesMonth;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hledat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-primary-500"
          />
        </div>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500"
        />
      </div>

      {/* Trips list */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Žádné jízdy k zobrazení</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onTripClick(trip)}
              className="p-3 bg-slate-800/30 hover:bg-slate-700/30 rounded-lg cursor-pointer transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-primary-400 text-sm min-w-[100px]">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(trip.start_date), 'd. M. yyyy', { locale: cs })}
                </div>

                <div className="flex-1 flex items-center gap-2 text-sm">
                  <MapPin className="w-3 h-3 text-green-400" />
                  <span className="text-white">{trip.start_location}</span>
                  <span className="text-slate-500">→</span>
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span className="text-white">{trip.end_location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{trip.driver_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent-400 font-medium">
                    <Gauge className="w-3 h-3" />
                    <span>{trip.distance} km</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg text-sm">
        <span className="text-slate-400">Celkem jízd: </span>
        <span className="text-white font-medium">{filteredTrips.length}</span>
        <span className="text-slate-400 mx-2">|</span>
        <span className="text-slate-400">Celkem km: </span>
        <span className="text-accent-400 font-medium">
          {filteredTrips.reduce((sum, t) => sum + t.distance, 0).toLocaleString('cs-CZ')} km
        </span>
      </div>
    </div>
  );
}

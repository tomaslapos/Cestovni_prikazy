import { useMemo } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { MapPin, Calendar, Car, User, Gauge, TrendingUp } from 'lucide-react';
import { Trip } from '../../types';

interface TripListProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
  loading: boolean;
}

export function TripList({ trips, onTripClick, loading }: TripListProps) {
  // Calculate total distance from filtered trips
  const totalDistance = useMemo(() => {
    return trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
  }, [trips]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Žádné jízdy k zobrazení</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Summary - Total distance */}
      <div className="glass rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Najeto celkem</p>
            <p className="text-2xl font-bold text-white">
              {totalDistance.toLocaleString('cs-CZ')} km
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Počet jízd</p>
          <p className="text-xl font-semibold text-primary-400">{trips.length}</p>
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden md:flex items-center gap-4 px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 mb-2">
        <div className="min-w-[140px] flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          Datum
        </div>
        <div className="flex-1 flex items-center gap-2">
          <MapPin className="w-3 h-3" />
          Trasa
        </div>
        <div className="w-[100px] flex items-center gap-2">
          <Car className="w-3 h-3" />
          Vozidlo
        </div>
        <div className="w-[100px] flex items-center gap-2">
          <User className="w-3 h-3" />
          Řidič
        </div>
        <div className="min-w-[80px] text-right flex items-center gap-2 justify-end">
          <Gauge className="w-3 h-3" />
          Vzdálenost
        </div>
      </div>

      {/* Trip list */}
      <div className="space-y-2">
        {trips.map((trip, index) => (
          <div
            key={trip.id}
            onClick={() => onTripClick(trip)}
            className="glass rounded-xl p-4 cursor-pointer hover:bg-slate-700/30 transition-all group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Date */}
              <div className="flex items-center gap-2 text-primary-400 min-w-[140px]">
                <Calendar className="w-4 h-4 md:hidden" />
                <span className="text-sm font-medium">
                  {format(new Date(trip.start_date), 'd. MMMM yyyy', { locale: cs })}
                </span>
              </div>

              {/* Route */}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="font-medium">{trip.start_location}</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span className="font-medium">{trip.end_location}</span>
                </div>
              </div>

              {/* Vehicle */}
              <div className="w-[100px] flex items-center gap-1 text-sm text-slate-400">
                <Car className="w-4 h-4 md:hidden" />
                <span className="truncate">{trip.vehicle?.name || 'N/A'}</span>
              </div>

              {/* Driver */}
              <div className="w-[100px] flex items-center gap-1 text-sm text-slate-400">
                <User className="w-4 h-4 md:hidden" />
                <span className="truncate">{trip.driver_name}</span>
              </div>

              {/* Distance */}
              <div className="flex items-center gap-1 text-accent-400 font-semibold min-w-[80px] justify-end">
                <Gauge className="w-4 h-4 md:hidden" />
                <span>{trip.distance} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { X, MapPin, Calendar, Car, User, Gauge, Target, Edit, Trash2 } from 'lucide-react';
import { Trip } from '../../types';

interface TripDetailProps {
  trip: Trip;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TripDetail({ trip, onClose, onEdit, onDelete }: TripDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Detail jízdy</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="text-lg font-medium">{trip.start_location}</span>
            <span className="text-white/50">→</span>
            <span className="text-lg font-medium">{trip.end_location}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                Datum začátku
              </div>
              <p className="text-white font-medium">
                {format(new Date(trip.start_date), 'd. MMMM yyyy HH:mm', { locale: cs })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                Datum konce
              </div>
              <p className="text-white font-medium">
                {format(new Date(trip.end_date), 'd. MMMM yyyy HH:mm', { locale: cs })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Car className="w-4 h-4" />
                Vozidlo
              </div>
              <p className="text-white font-medium">
                {trip.vehicle?.name || 'N/A'}
                <span className="text-slate-400 ml-2">({trip.vehicle?.spz})</span>
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <User className="w-4 h-4" />
                Řidič
              </div>
              <p className="text-white font-medium">{trip.driver_name}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Target className="w-4 h-4" />
                Účel
              </div>
              <p className="text-white font-medium">{trip.purpose}</p>
            </div>
          </div>

          {/* Kilometers */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Gauge className="w-4 h-4" />
              Stav kilometrů
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-slate-400 text-xs mb-1">Počáteční</p>
                <p className="text-white text-lg font-bold">{trip.start_km.toLocaleString('cs-CZ')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Konečný</p>
                <p className="text-white text-lg font-bold">{trip.end_km.toLocaleString('cs-CZ')}</p>
              </div>
              <div>
                <p className="text-accent-400 text-xs mb-1">Najeto</p>
                <p className="text-accent-400 text-lg font-bold">{trip.distance} km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all"
          >
            <Edit className="w-4 h-4" />
            Upravit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 border border-red-500/50 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Odstranit
          </button>
        </div>
      </div>
    </div>
  );
}

import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Car, User, Calendar, Gauge, Building } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
  loading: boolean;
}

export function VehicleList({ vehicles, onVehicleClick, loading }: VehicleListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Žádná vozidla k zobrazení</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {vehicles.map((vehicle, index) => {
        const isActive = !vehicle.disposal_date || new Date(vehicle.disposal_date) > new Date();
        
        return (
          <div
            key={vehicle.id}
            onClick={() => onVehicleClick(vehicle)}
            className="glass rounded-xl p-5 cursor-pointer hover:bg-slate-700/30 transition-all group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isActive 
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500' 
                    : 'bg-slate-700'
                }`}>
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-primary-400 font-mono">{vehicle.spz}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {isActive ? 'Aktivní' : 'Vyřazeno'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="w-4 h-4" />
                <span>{vehicle.driver_name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Building className="w-4 h-4" />
                <span>{vehicle.department}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(vehicle.acquisition_date), 'd. M. yyyy', { locale: cs })}
                  {vehicle.disposal_date && (
                    <> — {format(new Date(vehicle.disposal_date), 'd. M. yyyy', { locale: cs })}</>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Gauge className="w-4 h-4" />
                  <span className="text-xs">Stav km</span>
                </div>
                <div className="text-right">
                  <p className="text-accent-400 font-bold">
                    {vehicle.current_km.toLocaleString('cs-CZ')} km
                  </p>
                  <p className="text-xs text-slate-500">
                    z {vehicle.initial_km.toLocaleString('cs-CZ')} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

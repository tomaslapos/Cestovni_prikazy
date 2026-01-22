import { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { X, Car, User, Calendar, Gauge, Building, CreditCard, Edit, MapPin } from 'lucide-react';
import { Vehicle, Trip } from '../../types';
import { VehicleTrips } from './VehicleTrips';
import { VehicleForm } from './VehicleForm';

type Tab = 'detail' | 'trips';

interface VehicleDetailProps {
  vehicle: Vehicle;
  trips: Trip[];
  tripsLoading: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<Vehicle>) => Promise<boolean>;
  onTripClick: (trip: Trip) => void;
}

export function VehicleDetail({
  vehicle,
  trips,
  tripsLoading,
  onClose,
  onUpdate,
  onTripClick,
}: VehicleDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('detail');
  const [showEditForm, setShowEditForm] = useState(false);
  const isActive = !vehicle.disposal_date || new Date(vehicle.disposal_date) > new Date();

  if (showEditForm) {
    return (
      <VehicleForm
        vehicle={vehicle}
        onSubmit={async (data) => {
          const success = await onUpdate(data);
          if (success) setShowEditForm(false);
          return success;
        }}
        onClose={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-white">{vehicle.name}</h2>
                <p className="text-white/80 font-mono">{vehicle.spz}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive 
                  ? 'bg-green-500/30 text-green-200' 
                  : 'bg-red-500/30 text-red-200'
              }`}>
                {isActive ? 'Aktivní' : 'Vyřazeno'}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'detail'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Detail vozidla
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'trips'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Jízdy vozidla
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {trips.length}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'detail' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <CreditCard className="w-4 h-4" />
                    Vlastnictví
                  </div>
                  <p className="text-white font-medium">{vehicle.ownership}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Building className="w-4 h-4" />
                    Středisko
                  </div>
                  <p className="text-white font-medium">{vehicle.department}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <User className="w-4 h-4" />
                    Řidič
                  </div>
                  <p className="text-white font-medium">{vehicle.driver_name}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    Datum pořízení
                  </div>
                  <p className="text-white font-medium">
                    {format(new Date(vehicle.acquisition_date), 'd. MMMM yyyy', { locale: cs })}
                  </p>
                </div>

                {vehicle.disposal_date && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      Datum vyřazení
                    </div>
                    <p className="text-white font-medium">
                      {format(new Date(vehicle.disposal_date), 'd. MMMM yyyy', { locale: cs })}
                    </p>
                  </div>
                )}
              </div>

              {/* Kilometers */}
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <Gauge className="w-4 h-4" />
                  Stav kilometrů
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Počáteční</p>
                    <p className="text-white text-lg font-bold">
                      {vehicle.initial_km.toLocaleString('cs-CZ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Aktuální</p>
                    <p className="text-accent-400 text-lg font-bold">
                      {vehicle.current_km.toLocaleString('cs-CZ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Najeto celkem</p>
                    <p className="text-primary-400 text-lg font-bold">
                      {(vehicle.current_km - vehicle.initial_km).toLocaleString('cs-CZ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setShowEditForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all"
              >
                <Edit className="w-4 h-4" />
                Upravit vozidlo
              </button>
            </div>
          ) : (
            <VehicleTrips
              trips={trips}
              loading={tripsLoading}
              onTripClick={onTripClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

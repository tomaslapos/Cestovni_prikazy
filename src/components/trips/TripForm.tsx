import { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Car, User, Target, RotateCcw } from 'lucide-react';
import { Vehicle, Trip, TripFormData } from '../../types';

interface TripFormProps {
  trip?: Trip;
  vehicles: Vehicle[];
  drivers: string[];
  cities: string[];
  onSubmit: (data: TripFormData, createReturnTrip: boolean) => Promise<boolean>;
  onClose: () => void;
  getDistance: (start: string, end: string) => number | null;
  getVehicleCurrentKm: (vehicleId: string) => number;
}

export function TripForm({
  trip,
  vehicles,
  drivers,
  cities,
  onSubmit,
  onClose,
  getDistance,
  getVehicleCurrentKm,
}: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    vehicle_id: trip?.vehicle_id || '',
    driver_name: trip?.driver_name || '',
    start_date: trip?.start_date ? trip.start_date.slice(0, 10) : '',
    end_date: trip?.end_date ? trip.end_date.slice(0, 10) : '',
    purpose: trip?.purpose || 'služební',
    start_location: trip?.start_location || 'Ústí nad Labem',
    end_location: trip?.end_location || '',
  });

  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>(vehicles);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createReturnTrip, setCreateReturnTrip] = useState(!trip); // Defaultně zaškrtnuto pro nové jízdy

  // Filter active vehicles based on start date
  useEffect(() => {
    if (formData.start_date) {
      const checkDate = new Date(formData.start_date);
      const filtered = vehicles.filter((vehicle) => {
        const acquisitionDate = new Date(vehicle.acquisition_date);
        const disposalDate = vehicle.disposal_date ? new Date(vehicle.disposal_date) : null;
        return checkDate >= acquisitionDate && (!disposalDate || checkDate <= disposalDate);
      });
      setActiveVehicles(filtered);

      // Reset vehicle if not in active list
      if (formData.vehicle_id && !filtered.find((v) => v.id === formData.vehicle_id)) {
        setFormData((prev) => ({ ...prev, vehicle_id: '' }));
      }
    } else {
      setActiveVehicles(vehicles);
    }
  }, [formData.start_date, vehicles, formData.vehicle_id]);

  // Calculate distance when locations change
  useEffect(() => {
    if (formData.start_location && formData.end_location) {
      const dist = getDistance(formData.start_location, formData.end_location);
      setCalculatedDistance(dist);
    } else {
      setCalculatedDistance(null);
    }
  }, [formData.start_location, formData.end_location, getDistance]);

  // Get current km when vehicle changes
  useEffect(() => {
    if (formData.vehicle_id) {
      const km = getVehicleCurrentKm(formData.vehicle_id);
      setCurrentKm(km);
    }
  }, [formData.vehicle_id, getVehicleCurrentKm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (calculatedDistance === null) {
      setError('Nelze vypočítat vzdálenost mezi zvolenými městy');
      return;
    }

    setLoading(true);
    const success = await onSubmit(formData, createReturnTrip && !trip);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError('Chyba při ukládání jízdy');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">
              {trip ? 'Upravit jízdu' : 'Nová jízda'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4" />
                Datum začátku
              </label>
              <input
                type="date"
                value={formData.start_date.slice(0, 10)}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4" />
                Datum konce
              </label>
              <input
                type="date"
                value={formData.end_date.slice(0, 10)}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              />
            </div>
          </div>

          {/* Vehicle */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Car className="w-4 h-4" />
              Vozidlo
            </label>
            <select
              value={formData.vehicle_id}
              onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
              required
            >
              <option value="">Vyberte vozidlo</option>
              {activeVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.spz})
                </option>
              ))}
            </select>
            {formData.vehicle_id && (
              <p className="text-xs text-slate-400">
                Aktuální stav: {currentKm.toLocaleString('cs-CZ')} km
              </p>
            )}
          </div>

          {/* Driver (optional) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <User className="w-4 h-4" />
              Řidič
              <span className="text-slate-500 text-xs">(nepovinné)</span>
            </label>
            <select
              value={formData.driver_name}
              onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
            >
              <option value="">-- Nevybráno --</option>
              {drivers.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Target className="w-4 h-4" />
              Účel
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
              required
            />
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <MapPin className="w-4 h-4 text-green-400" />
                Začátek cesty
              </label>
              <select
                value={formData.start_location}
                onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              >
                <option value="">Vyberte město</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <MapPin className="w-4 h-4 text-red-400" />
                Cíl cesty
              </label>
              <select
                value={formData.end_location}
                onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              >
                <option value="">Vyberte město</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Distance info */}
          {calculatedDistance !== null && (
            <div className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-xl">
              <p className="text-accent-400 text-sm">
                Vzdálenost: <span className="font-bold text-lg">{calculatedDistance} km</span>
              </p>
              {formData.vehicle_id && (
                <p className="text-slate-400 text-sm mt-1">
                  Nový stav km: {(currentKm + calculatedDistance).toLocaleString('cs-CZ')} km
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Return trip checkbox - only for new trips */}
          {!trip && formData.start_location !== formData.end_location && (
            <label className="flex items-center gap-3 p-4 bg-slate-800/30 border border-slate-600/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={createReturnTrip}
                onChange={(e) => setCreateReturnTrip(e.target.checked)}
                className="w-5 h-5 rounded border-slate-500 bg-slate-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary-400" />
                <div>
                  <span className="text-sm font-medium text-white">Vytvořit zpáteční jízdu</span>
                  <p className="text-xs text-slate-400">
                    {formData.end_location} → {formData.start_location}
                  </p>
                </div>
              </div>
            </label>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading || calculatedDistance === null}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Ukládání...' : trip ? 'Uložit změny' : 'Vytvořit jízdu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

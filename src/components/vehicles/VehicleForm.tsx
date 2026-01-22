import { useState } from 'react';
import { X, Car, User, Building, Calendar, Gauge, CreditCard } from 'lucide-react';
import { Vehicle, VehicleFormData } from '../../types';

interface VehicleFormProps {
  vehicle: Vehicle;
  onSubmit: (data: Partial<VehicleFormData>) => Promise<boolean>;
  onClose: () => void;
}

export function VehicleForm({ vehicle, onSubmit, onClose }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    name: vehicle.name,
    spz: vehicle.spz,
    ownership: vehicle.ownership,
    department: vehicle.department,
    driver_name: vehicle.driver_name,
    acquisition_date: vehicle.acquisition_date,
    disposal_date: vehicle.disposal_date,
    initial_km: vehicle.initial_km,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const success = await onSubmit(formData);
    setLoading(false);

    if (!success) {
      setError('Chyba při ukládání vozidla');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Upravit vozidlo</h2>
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
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Car className="w-4 h-4" />
              Název vozidla
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Car className="w-4 h-4" />
              SPZ
            </label>
            <input
              type="text"
              value={formData.spz}
              onChange={(e) => setFormData({ ...formData, spz: e.target.value.toUpperCase() })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white font-mono focus:border-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <CreditCard className="w-4 h-4" />
                Vlastnictví
              </label>
              <select
                value={formData.ownership}
                onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              >
                <option value="vlastní">Vlastní</option>
                <option value="leasing">Leasing</option>
                <option value="pronájem">Pronájem</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Building className="w-4 h-4" />
                Středisko
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <User className="w-4 h-4" />
              Řidič
            </label>
            <input
              type="text"
              value={formData.driver_name}
              onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4" />
                Datum pořízení
              </label>
              <input
                type="date"
                value={formData.acquisition_date}
                onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4" />
                Datum vyřazení
              </label>
              <input
                type="date"
                value={formData.disposal_date || ''}
                onChange={(e) =>
                  setFormData({ ...formData, disposal_date: e.target.value || null })
                }
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Gauge className="w-4 h-4" />
              Počáteční stav km
            </label>
            <input
              type="number"
              value={formData.initial_km}
              onChange={(e) => setFormData({ ...formData, initial_km: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 px-3 text-white focus:border-primary-500"
              required
              min="0"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

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
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Ukládání...' : 'Uložit změny'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

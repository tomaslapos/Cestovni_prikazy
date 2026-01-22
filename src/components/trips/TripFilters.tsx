import { Calendar, Car, User, Download, LayoutGrid, List } from 'lucide-react';
import { Vehicle, TripFilters as TripFiltersType, ViewMode } from '../../types';

interface TripFiltersProps {
  filters: TripFiltersType;
  onFiltersChange: (filters: TripFiltersType) => void;
  vehicles: Vehicle[];
  drivers: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onExport: () => void;
  onAddTrip: () => void;
}

export function TripFilters({
  filters,
  onFiltersChange,
  vehicles,
  drivers,
  viewMode,
  onViewModeChange,
  onExport,
  onAddTrip,
}: TripFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Leden' },
    { value: 2, label: 'Únor' },
    { value: 3, label: 'Březen' },
    { value: 4, label: 'Duben' },
    { value: 5, label: 'Květen' },
    { value: 6, label: 'Červen' },
    { value: 7, label: 'Červenec' },
    { value: 8, label: 'Srpen' },
    { value: 9, label: 'Září' },
    { value: 10, label: 'Říjen' },
    { value: 11, label: 'Listopad' },
    { value: 12, label: 'Prosinec' },
  ];

  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* View mode toggle */}
        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg">
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'calendar'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Kalendář
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            Seznam
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={filters.month || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  month: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500"
            >
              <option value="">Měsíc</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={filters.year || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  year: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500"
            >
              <option value="">Rok</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-slate-400" />
            <select
              value={filters.vehicle_id || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  vehicle_id: e.target.value || null,
                })
              }
              className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500"
            >
              <option value="">Všechna vozidla</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.spz})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={filters.driver_name || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  driver_name: e.target.value || null,
                })
              }
              className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500"
            >
              <option value="">Všichni řidiči</option>
              {drivers.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={onAddTrip}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg shadow-lg shadow-primary-500/25 transition-all"
          >
            + Přidat jízdu
          </button>
        </div>
      </div>
    </div>
  );
}

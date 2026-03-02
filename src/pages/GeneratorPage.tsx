import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Plus, Zap, Car, Calendar, Gauge, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useDistances } from '../hooks/useDistances';
import { useGenerator } from '../hooks/useGenerator';
import { supabase } from '../lib/supabase';
import { generateTrips } from '../lib/tripGenerator';
import { Vehicle } from '../types';

interface NewRequest {
  vehicleId: string;
  dateFrom: string;
  dateTo: string;
  targetOdometer: string;
}

export function GeneratorPage() {
  const { vehicles, updateVehicleKm } = useVehicles();
  const { distances } = useDistances();
  const { requests, loading, createRequest, getLastDateForVehicle, fetchRequests } = useGenerator();

  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState<NewRequest>({
    vehicleId: '',
    dateFrom: '',
    dateTo: format(new Date(), 'yyyy-MM-dd'),
    targetOdometer: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [dateFromLocked, setDateFromLocked] = useState(false);

  // Filter only active vehicles
  const activeVehicles = vehicles.filter((v) => {
    return !v.disposal_date || new Date(v.disposal_date) > new Date();
  });

  // When vehicle changes, calculate date_from
  useEffect(() => {
    if (!newRequest.vehicleId) {
      setNewRequest((prev) => ({ ...prev, dateFrom: '' }));
      setDateFromLocked(false);
      return;
    }

    const vehicle = vehicles.find((v) => v.id === newRequest.vehicleId);
    if (!vehicle) return;

    const calculateDateFrom = async () => {
      const lastDate = await getLastDateForVehicle(newRequest.vehicleId);
      
      if (lastDate) {
        setNewRequest((prev) => ({ ...prev, dateFrom: lastDate }));
      } else {
        // Use acquisition date
        setNewRequest((prev) => ({ ...prev, dateFrom: vehicle.acquisition_date }));
      }
      setDateFromLocked(true);
    };

    calculateDateFrom();
  }, [newRequest.vehicleId, vehicles, getLastDateForVehicle]);

  const getVehicleLabel = (vehicle: Vehicle) => `${vehicle.spz} – ${vehicle.name}`;

  const handleAddClick = useCallback(() => {
    setShowForm(true);
    setNewRequest({
      vehicleId: '',
      dateFrom: '',
      dateTo: format(new Date(), 'yyyy-MM-dd'),
      targetOdometer: '',
    });
    setShowConfirm(false);
    setGenerationError(null);
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === newRequest.vehicleId);

  // Vypočítej najeté km z tachometru
  const calculatedKm = selectedVehicle && newRequest.targetOdometer
    ? parseInt(newRequest.targetOdometer, 10) - selectedVehicle.current_km
    : 0;

  const handlePrepare = useCallback(() => {
    if (!newRequest.vehicleId || !newRequest.dateFrom || !newRequest.dateTo || !newRequest.targetOdometer) {
      setGenerationError('Vyplňte všechna pole');
      return;
    }
    
    const odometer = parseInt(newRequest.targetOdometer, 10);
    if (isNaN(odometer) || odometer <= 0) {
      setGenerationError('Zadejte platný stav tachometru');
      return;
    }

    const vehicle = vehicles.find((v) => v.id === newRequest.vehicleId);
    if (!vehicle) {
      setGenerationError('Vozidlo nenalezeno');
      return;
    }

    if (odometer <= vehicle.current_km) {
      setGenerationError(`Stav tachometru musí být vyšší než aktuální stav vozidla (${vehicle.current_km.toLocaleString('cs-CZ')} km)`);
      return;
    }

    if (new Date(newRequest.dateTo) <= new Date(newRequest.dateFrom)) {
      setGenerationError('Datum do musí být po datu od');
      return;
    }

    setGenerationError(null);
    setShowConfirm(true);
  }, [newRequest, vehicles]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenerationError(null);

    try {
      const vehicle = vehicles.find((v) => v.id === newRequest.vehicleId);
      if (!vehicle) throw new Error('Vozidlo nenalezeno');

      const targetKm = parseInt(newRequest.targetOdometer, 10) - vehicle.current_km;
      const dateFrom = new Date(newRequest.dateFrom);
      const dateTo = new Date(newRequest.dateTo);

      // Generate trips
      const result = generateTrips(
        vehicle.id,
        vehicle.driver_name,
        dateFrom,
        dateTo,
        targetKm,
        vehicle.current_km,
        distances
      );

      if (result.trips.length === 0) {
        throw new Error('V zadaném období nejsou žádné pracovní dny');
      }

      // Check deviation
      const deviation = Math.abs(result.totalGeneratedKm - targetKm) / targetKm;
      if (deviation > 0.05) {
        throw new Error(
          `Nepodařilo se vygenerovat cesty s dostatečnou přesností. ` +
          `Cíl: ${targetKm} km, Vygenerováno: ${result.totalGeneratedKm} km (odchylka ${(deviation * 100).toFixed(1)}%). ` +
          `Zkuste upravit období nebo počet km.`
        );
      }

      // Insert all generated trips to Supabase
      const batchSize = 50;
      for (let i = 0; i < result.trips.length; i += batchSize) {
        const batch = result.trips.slice(i, i + batchSize);
        const { error } = await supabase.from('trips').insert(batch);
        if (error) throw error;
      }

      // Update vehicle current_km
      const lastTrip = result.trips[result.trips.length - 1];
      await updateVehicleKm(vehicle.id, lastTrip.end_km);

      // Save generator request record
      await createRequest(
        vehicle.id,
        newRequest.dateFrom,
        newRequest.dateTo,
        targetKm,
        result.totalGeneratedKm
      );

      // Reset form
      setShowForm(false);
      setShowConfirm(false);
      setNewRequest({
        vehicleId: '',
        dateFrom: '',
        dateTo: format(new Date(), 'yyyy-MM-dd'),
        targetOdometer: '',
      });

      await fetchRequests();
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Chyba při generování cest');
    } finally {
      setGenerating(false);
    }
  }, [newRequest, vehicles, distances, updateVehicleKm, createRequest, fetchRequests]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Generátor cest</h2>
          <p className="text-slate-400">Automatické generování služebních cest podle měsíčního nájezdu</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nový požadavek
        </button>
      </div>

      {/* Form for new request */}
      {showForm && (
        <div className="glass rounded-xl p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent-400" />
            Nový požadavek na generování
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Vehicle select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                <Car className="w-4 h-4 inline mr-1" />
                Vozidlo
              </label>
              <select
                value={newRequest.vehicleId}
                onChange={(e) => setNewRequest((prev) => ({ ...prev, vehicleId: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              >
                <option value="">Vyberte vozidlo</option>
                {activeVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {getVehicleLabel(v)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date from (readonly) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4 inline mr-1" />
                Datum od
              </label>
              <input
                type="date"
                value={newRequest.dateFrom}
                readOnly
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-slate-400 cursor-not-allowed opacity-70"
                title="Automaticky vypočteno z poslední cesty nebo data pořízení"
              />
              {dateFromLocked && newRequest.dateFrom && (
                <p className="text-xs text-slate-500">Automaticky z poslední cesty</p>
              )}
            </div>

            {/* Date to */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4 inline mr-1" />
                Datum do
              </label>
              <input
                type="date"
                value={newRequest.dateTo}
                onChange={(e) => setNewRequest((prev) => ({ ...prev, dateTo: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Target odometer */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                <Gauge className="w-4 h-4 inline mr-1" />
                Stav tachometru k datu do
              </label>
              <input
                type="number"
                value={newRequest.targetOdometer}
                onChange={(e) => setNewRequest((prev) => ({ ...prev, targetOdometer: e.target.value }))}
                placeholder={selectedVehicle ? `nyní ${selectedVehicle.current_km.toLocaleString('cs-CZ')} km` : 'např. 48000'}
                min="1"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              {selectedVehicle && newRequest.targetOdometer && calculatedKm > 0 && (
                <p className="text-xs text-accent-400">Najeté km: {calculatedKm.toLocaleString('cs-CZ')} km</p>
              )}
            </div>
          </div>

          {/* Summary before confirm */}
          {selectedVehicle && newRequest.dateFrom && newRequest.dateTo && newRequest.targetOdometer && calculatedKm > 0 && (
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4 border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Shrnutí požadavku:</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Vozidlo:</span>
                  <p className="text-white font-medium">{getVehicleLabel(selectedVehicle)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Období:</span>
                  <p className="text-white font-medium">
                    {format(new Date(newRequest.dateFrom), 'd.M.yyyy', { locale: cs })} – {format(new Date(newRequest.dateTo), 'd.M.yyyy', { locale: cs })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Aktuální stav km:</span>
                  <p className="text-white font-medium">{selectedVehicle.current_km.toLocaleString('cs-CZ')} km</p>
                </div>
                <div>
                  <span className="text-slate-500">Cílový tachometr:</span>
                  <p className="text-white font-medium">{parseInt(newRequest.targetOdometer).toLocaleString('cs-CZ')} km</p>
                </div>
                <div>
                  <span className="text-slate-500">Najeté km:</span>
                  <p className="text-accent-400 font-bold">{calculatedKm.toLocaleString('cs-CZ')} km</p>
                </div>
              </div>
            </div>
          )}

          {generationError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 rounded-lg p-3 mb-4">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{generationError}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {!showConfirm ? (
              <>
                <button
                  onClick={handlePrepare}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Zkontrolovat a připravit
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                >
                  Zrušit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-red-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {generating ? 'Generuji...' : 'Opravdu chcete vygenerovat služební cesty?'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={generating}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all disabled:opacity-50"
                >
                  Zpět
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* List of generator requests */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Zatím žádné vygenerované požadavky</p>
          <p className="text-sm mt-2">Klikněte na "Nový požadavek" pro automatické generování služebních cest</p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {requests.map((req, index) => (
            <div
              key={req.id}
              className="glass rounded-xl p-5 transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {req.vehicle?.spz} – {req.vehicle?.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {format(new Date(req.date_from), 'd.M.yyyy', { locale: cs })} – {format(new Date(req.date_to), 'd.M.yyyy', { locale: cs })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Požadovaný nájezd</p>
                    <p className="text-white font-bold">{req.total_km.toLocaleString('cs-CZ')} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Vygenerováno</p>
                    <p className="text-accent-400 font-bold">{req.generated_km.toLocaleString('cs-CZ')} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Odchylka</p>
                    <p className={`font-bold ${
                      Math.abs(req.generated_km - req.total_km) / req.total_km <= 0.03 
                        ? 'text-green-400' 
                        : 'text-amber-400'
                    }`}>
                      {((req.generated_km - req.total_km) / req.total_km * 100).toFixed(1)}%
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Dokončeno
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
                Vygenerováno: {format(new Date(req.created_at), 'd.M.yyyy HH:mm', { locale: cs })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle, VehicleFormData } from '../types';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');

      if (error) throw error;
      setVehicles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při načítání vozidel');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const getActiveVehicles = useCallback((date: string) => {
    const checkDate = new Date(date);
    return vehicles.filter((vehicle) => {
      const acquisitionDate = new Date(vehicle.acquisition_date);
      const disposalDate = vehicle.disposal_date ? new Date(vehicle.disposal_date) : null;
      
      return checkDate >= acquisitionDate && (!disposalDate || checkDate <= disposalDate);
    });
  }, [vehicles]);

  const getVehicleById = useCallback((id: string) => {
    return vehicles.find((v) => v.id === id);
  }, [vehicles]);

  const updateVehicle = useCallback(async (id: string, data: Partial<VehicleFormData>) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await fetchVehicles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při aktualizaci vozidla');
      return false;
    }
  }, [fetchVehicles]);

  const updateVehicleKm = useCallback(async (id: string, newKm: number) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ current_km: newKm })
        .eq('id', id);

      if (error) throw error;
      await fetchVehicles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při aktualizaci km');
      return false;
    }
  }, [fetchVehicles]);

  const recalculateVehicleKm = useCallback(async (id: string) => {
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return false;

      // Sečti vzdálenosti všech existujících jízd vozidla
      const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('distance')
        .eq('vehicle_id', id);

      if (tripsError) throw tripsError;

      const totalDistance = (trips || []).reduce((sum, t) => sum + (t.distance || 0), 0);
      const correctKm = vehicle.initial_km + totalDistance;

      const { error } = await supabase
        .from('vehicles')
        .update({ current_km: correctKm })
        .eq('id', id);

      if (error) throw error;
      await fetchVehicles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při přepočtu km');
      return false;
    }
  }, [fetchVehicles, vehicles]);

  const createVehicle = useCallback(async (data: VehicleFormData) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert({
          ...data,
          current_km: data.initial_km,
        });

      if (error) throw error;
      await fetchVehicles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při vytváření vozidla');
      return false;
    }
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    getActiveVehicles,
    getVehicleById,
    updateVehicle,
    updateVehicleKm,
    recalculateVehicleKm,
    createVehicle,
  };
}

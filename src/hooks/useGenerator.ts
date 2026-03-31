import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { GeneratorRequest } from '../types';

export function useGenerator() {
  const [requests, setRequests] = useState<GeneratorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('generator_requests')
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při načítání požadavků');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = useCallback(async (
    vehicleId: string,
    dateFrom: string,
    dateTo: string,
    totalKm: number,
    generatedKm: number
  ) => {
    try {
      const { error } = await supabase
        .from('generator_requests')
        .insert({
          vehicle_id: vehicleId,
          date_from: dateFrom,
          date_to: dateTo,
          total_km: totalKm,
          generated_km: generatedKm,
          status: 'completed',
        });

      if (error) throw error;
      await fetchRequests();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při vytváření požadavku');
      return false;
    }
  }, [fetchRequests]);

  const getLastDateForVehicle = useCallback(async (vehicleId: string): Promise<string | null> => {
    try {
      // Pouze z reálně existujících jízd v DB (ne z generator_requests)
      const { data: tripData } = await supabase
        .from('trips')
        .select('end_date')
        .eq('vehicle_id', vehicleId)
        .order('end_date', { ascending: false })
        .limit(1);

      if (!tripData || tripData.length === 0) return null;

      // Return date as YYYY-MM-DD (next day after last trip)
      const latest = new Date(tripData[0].end_date);
      const nextDay = new Date(latest);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    } catch {
      return null;
    }
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    getLastDateForVehicle,
  };
}

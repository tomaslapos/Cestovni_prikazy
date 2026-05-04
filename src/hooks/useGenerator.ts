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
      // 1. Číst last_trip_date z vehicles cache
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('last_trip_date')
        .eq('id', vehicleId)
        .single();

      let lastTripDate = vehicle?.last_trip_date?.slice(0, 10) || null;

      // Fallback: pokud cache je prázdný, dotáži přímo poslední jízdu
      if (!lastTripDate) {
        const { data: lastTrip } = await supabase
          .from('trips')
          .select('end_date')
          .eq('vehicle_id', vehicleId)
          .order('end_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        lastTripDate = lastTrip?.end_date?.slice(0, 10) || null;
      }

      // 2. Číst date_to z posledního dokončeného generator requestu
      const { data: lastRequest } = await supabase
        .from('generator_requests')
        .select('date_to')
        .eq('vehicle_id', vehicleId)
        .eq('status', 'completed')
        .order('date_to', { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastRequestDate = lastRequest?.date_to?.slice(0, 10) || null;

      // 3. Vezmi pozdější z obou datumů
      let lastDate: string | null = null;
      if (lastTripDate && lastRequestDate) {
        lastDate = lastTripDate > lastRequestDate ? lastTripDate : lastRequestDate;
      } else {
        lastDate = lastTripDate || lastRequestDate;
      }

      if (!lastDate) return null;

      // Return date as YYYY-MM-DD (next day after last date)
      const latest = new Date(lastDate);
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

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Trip, TripFormData, TripFilters } from '../types';

export function useTrips(vehicleId?: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async (filters?: TripFilters) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('trips')
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .order('start_date', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      if (filters) {
        if (filters.vehicle_id) {
          query = query.eq('vehicle_id', filters.vehicle_id);
        }
        if (filters.driver_name) {
          query = query.eq('driver_name', filters.driver_name);
        }
        if (filters.year && filters.month) {
          const startDate = new Date(filters.year, filters.month - 1, 1);
          const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59);
          query = query
            .gte('start_date', startDate.toISOString())
            .lte('start_date', endDate.toISOString());
        } else if (filters.year) {
          const startDate = new Date(filters.year, 0, 1);
          const endDate = new Date(filters.year, 11, 31, 23, 59, 59);
          query = query
            .gte('start_date', startDate.toISOString())
            .lte('start_date', endDate.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setTrips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při načítání jízd');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const createTrip = useCallback(async (
    data: TripFormData,
    startKm: number,
    distance: number,
    createReturnTrip: boolean = true
  ) => {
    try {
      const tripData = {
        ...data,
        start_km: startKm,
        end_km: startKm + distance,
        distance,
      };

      const { error } = await supabase
        .from('trips')
        .insert(tripData);

      if (error) throw error;

      // Automaticky vytvořit zpáteční jízdu s prohozenými lokacemi
      if (createReturnTrip && data.start_location !== data.end_location) {
        const returnTripData = {
          ...data,
          start_location: data.end_location,
          end_location: data.start_location,
          start_km: startKm + distance,
          end_km: startKm + distance + distance,
          distance,
        };

        const { error: returnError } = await supabase
          .from('trips')
          .insert(returnTripData);

        if (returnError) {
          console.error('Chyba při vytváření zpáteční jízdy:', returnError);
        }
      }

      await fetchTrips();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při vytváření jízdy');
      return false;
    }
  }, [fetchTrips]);

  const updateTrip = useCallback(async (
    id: string,
    data: Partial<TripFormData>,
    startKm?: number,
    distance?: number
  ) => {
    try {
      const updateData: Record<string, unknown> = { ...data };
      
      if (startKm !== undefined && distance !== undefined) {
        updateData.start_km = startKm;
        updateData.end_km = startKm + distance;
        updateData.distance = distance;
      }

      const { error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await fetchTrips();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při aktualizaci jízdy');
      return false;
    }
  }, [fetchTrips]);

  const deleteTrip = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTrips();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při mazání jízdy');
      return false;
    }
  }, [fetchTrips]);

  const getTripById = useCallback((id: string) => {
    return trips.find((t) => t.id === id);
  }, [trips]);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTripById,
  };
}

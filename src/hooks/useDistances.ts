import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Distance } from '../types';

export function useDistances() {
  const [distances, setDistances] = useState<Distance[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDistances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('distances')
        .select('*')
        .order('end_city');

      if (error) throw error;
      
      setDistances(data || []);
      
      // Extract unique cities
      const uniqueCities = new Set<string>();
      data?.forEach((d) => {
        uniqueCities.add(d.start_city);
        uniqueCities.add(d.end_city);
      });
      setCities(Array.from(uniqueCities).sort());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při načítání vzdáleností');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistances();
  }, [fetchDistances]);

  const getDistance = useCallback((startCity: string, endCity: string): number | null => {
    // If same city, return 0
    if (startCity === endCity) return 0;

    // Try to find direct distance
    let distance = distances.find(
      (d) => 
        (d.start_city === startCity && d.end_city === endCity) ||
        (d.start_city === endCity && d.end_city === startCity)
    );

    if (distance) {
      return distance.distance_km;
    }

    // If not found directly, calculate via Ústí nad Labem
    const BASE_CITY = 'Ústí nad Labem';
    
    if (startCity === BASE_CITY) {
      distance = distances.find((d) => d.end_city === endCity);
      return distance?.distance_km || null;
    }
    
    if (endCity === BASE_CITY) {
      distance = distances.find((d) => d.end_city === startCity);
      return distance?.distance_km || null;
    }

    // Calculate via base city (approximate)
    const startToBase = distances.find((d) => d.end_city === startCity);
    const baseToEnd = distances.find((d) => d.end_city === endCity);

    if (startToBase && baseToEnd) {
      // This is an approximation - in reality you might want more sophisticated routing
      return Math.abs(startToBase.distance_km - baseToEnd.distance_km);
    }

    return null;
  }, [distances]);

  return {
    distances,
    cities,
    loading,
    error,
    getDistance,
  };
}

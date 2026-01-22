import { useState, useMemo, useCallback } from 'react';
import { TripFilters } from '../components/trips/TripFilters';
import { TripCalendar } from '../components/trips/TripCalendar';
import { TripList } from '../components/trips/TripList';
import { TripDetail } from '../components/trips/TripDetail';
import { TripForm } from '../components/trips/TripForm';
import { useTrips } from '../hooks/useTrips';
import { useVehicles } from '../hooks/useVehicles';
import { useDistances } from '../hooks/useDistances';
import { Trip, TripFilters as TripFiltersType, ViewMode, TripFormData } from '../types';
import { exportTripsToCSV } from '../lib/csvExport';

export function TripsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [filters, setFilters] = useState<TripFiltersType>({
    month: null,
    year: null,
    vehicle_id: null,
    driver_name: null,
  });
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const { trips, loading, fetchTrips, createTrip, updateTrip, deleteTrip } = useTrips();
  const { vehicles, getVehicleById, updateVehicleKm } = useVehicles();
  const { cities, getDistance } = useDistances();

  // Apply filters
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (filters.vehicle_id && trip.vehicle_id !== filters.vehicle_id) return false;
      if (filters.driver_name && trip.driver_name !== filters.driver_name) return false;
      
      if (filters.year) {
        const tripDate = new Date(trip.start_date);
        if (tripDate.getFullYear() !== filters.year) return false;
        if (filters.month && tripDate.getMonth() + 1 !== filters.month) return false;
      }
      
      return true;
    });
  }, [trips, filters]);

  // Get unique drivers from trips and vehicles (filter out empty strings)
  const drivers = useMemo(() => {
    const driverSet = new Set<string>();
    trips.forEach((t) => {
      if (t.driver_name) driverSet.add(t.driver_name);
    });
    vehicles.forEach((v) => {
      if (v.driver_name) driverSet.add(v.driver_name);
    });
    return Array.from(driverSet).filter(d => d.trim() !== '').sort();
  }, [trips, vehicles]);

  const handleFiltersChange = useCallback((newFilters: TripFiltersType) => {
    setFilters(newFilters);
    fetchTrips(newFilters);
  }, [fetchTrips]);

  const handleExport = useCallback(() => {
    exportTripsToCSV(filteredTrips, 'jizdy');
  }, [filteredTrips]);

  const handleTripClick = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
  }, []);

  const handleAddTrip = useCallback(() => {
    setEditingTrip(null);
    setShowForm(true);
  }, []);

  const handleEditTrip = useCallback(() => {
    if (selectedTrip) {
      setEditingTrip(selectedTrip);
      setSelectedTrip(null);
      setShowForm(true);
    }
  }, [selectedTrip]);

  const handleDeleteTrip = useCallback(async () => {
    if (selectedTrip && window.confirm('Opravdu chcete odstranit tuto jízdu?')) {
      await deleteTrip(selectedTrip.id);
      setSelectedTrip(null);
    }
  }, [selectedTrip, deleteTrip]);

  const handleFormSubmit = useCallback(async (data: TripFormData, createReturnTrip: boolean): Promise<boolean> => {
    const distance = getDistance(data.start_location, data.end_location);
    if (distance === null) return false;

    const vehicle = getVehicleById(data.vehicle_id);
    if (!vehicle) return false;

    const startKm = vehicle.current_km;

    let success: boolean;
    if (editingTrip) {
      success = await updateTrip(editingTrip.id, data, startKm, distance);
    } else {
      success = await createTrip(data, startKm, distance, createReturnTrip);
      if (success) {
        // Update vehicle's current km (double if return trip created)
        const totalDistance = createReturnTrip ? distance * 2 : distance;
        await updateVehicleKm(data.vehicle_id, startKm + totalDistance);
      }
    }

    if (success) {
      setShowForm(false);
      setEditingTrip(null);
    }

    return success;
  }, [editingTrip, getDistance, getVehicleById, createTrip, updateTrip, updateVehicleKm]);

  const getVehicleCurrentKm = useCallback((vehicleId: string): number => {
    const vehicle = getVehicleById(vehicleId);
    return vehicle?.current_km || 0;
  }, [getVehicleById]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <TripFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        vehicles={vehicles}
        drivers={drivers}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        onAddTrip={handleAddTrip}
      />

      {viewMode === 'calendar' ? (
        <TripCalendar trips={filteredTrips} onTripClick={handleTripClick} />
      ) : (
        <TripList trips={filteredTrips} onTripClick={handleTripClick} loading={loading} />
      )}

      {selectedTrip && (
        <TripDetail
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />
      )}

      {showForm && (
        <TripForm
          trip={editingTrip || undefined}
          vehicles={vehicles}
          drivers={drivers}
          cities={cities}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingTrip(null);
          }}
          getDistance={getDistance}
          getVehicleCurrentKm={getVehicleCurrentKm}
        />
      )}
    </div>
  );
}

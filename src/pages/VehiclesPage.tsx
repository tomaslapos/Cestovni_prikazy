import { useState, useCallback } from 'react';
import { VehicleList } from '../components/vehicles/VehicleList';
import { VehicleDetail } from '../components/vehicles/VehicleDetail';
import { TripDetail } from '../components/trips/TripDetail';
import { TripForm } from '../components/trips/TripForm';
import { useVehicles } from '../hooks/useVehicles';
import { useTrips } from '../hooks/useTrips';
import { useDistances } from '../hooks/useDistances';
import { Vehicle, Trip, TripFormData, VehicleFormData } from '../types';

export function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const { vehicles, loading, updateVehicle, getVehicleById, updateVehicleKm } = useVehicles();
  const { 
    trips: vehicleTrips, 
    loading: tripsLoading, 
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  } = useTrips(selectedVehicle?.id);
  const { cities, getDistance } = useDistances();

  // Get unique drivers
  const drivers = [...new Set(vehicles.map((v) => v.driver_name))].sort();

  const handleVehicleClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleVehicleUpdate = useCallback(async (data: Partial<VehicleFormData>) => {
    if (!selectedVehicle) return false;
    const success = await updateVehicle(selectedVehicle.id, data);
    if (success) {
      // Refresh selected vehicle data
      const updated = getVehicleById(selectedVehicle.id);
      if (updated) setSelectedVehicle(updated);
    }
    return success;
  }, [selectedVehicle, updateVehicle, getVehicleById]);

  const handleTripClick = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
  }, []);

  const handleEditTrip = useCallback(() => {
    if (selectedTrip) {
      setEditingTrip(selectedTrip);
      setSelectedTrip(null);
      setShowTripForm(true);
    }
  }, [selectedTrip]);

  const handleDeleteTrip = useCallback(async () => {
    if (selectedTrip && window.confirm('Opravdu chcete odstranit tuto jízdu?')) {
      await deleteTrip(selectedTrip.id);
      setSelectedTrip(null);
      fetchTrips();
    }
  }, [selectedTrip, deleteTrip, fetchTrips]);

  const handleFormSubmit = useCallback(async (data: TripFormData): Promise<boolean> => {
    const distance = getDistance(data.start_location, data.end_location);
    if (distance === null) return false;

    const vehicle = getVehicleById(data.vehicle_id);
    if (!vehicle) return false;

    const startKm = vehicle.current_km;

    let success: boolean;
    if (editingTrip) {
      success = await updateTrip(editingTrip.id, data, startKm, distance);
    } else {
      success = await createTrip(data, startKm, distance);
      if (success) {
        await updateVehicleKm(data.vehicle_id, startKm + distance);
      }
    }

    if (success) {
      setShowTripForm(false);
      setEditingTrip(null);
      fetchTrips();
    }

    return success;
  }, [editingTrip, getDistance, getVehicleById, createTrip, updateTrip, updateVehicleKm, fetchTrips]);

  const getVehicleCurrentKm = useCallback((vehicleId: string): number => {
    const vehicle = getVehicleById(vehicleId);
    return vehicle?.current_km || 0;
  }, [getVehicleById]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-white mb-2">Vozidla</h2>
        <p className="text-slate-400">Správa vozového parku</p>
      </div>

      <VehicleList
        vehicles={vehicles}
        onVehicleClick={handleVehicleClick}
        loading={loading}
      />

      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          trips={vehicleTrips}
          tripsLoading={tripsLoading}
          onClose={() => setSelectedVehicle(null)}
          onUpdate={handleVehicleUpdate}
          onTripClick={handleTripClick}
        />
      )}

      {selectedTrip && (
        <TripDetail
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />
      )}

      {showTripForm && (
        <TripForm
          trip={editingTrip || undefined}
          vehicles={vehicles}
          drivers={drivers}
          cities={cities}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowTripForm(false);
            setEditingTrip(null);
          }}
          getDistance={getDistance}
          getVehicleCurrentKm={getVehicleCurrentKm}
        />
      )}
    </div>
  );
}

export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  spz: string;
  ownership: string;
  department: string;
  driver_name: string;
  acquisition_date: string;
  disposal_date: string | null;
  initial_km: number;
  current_km: number;
  created_at: string;
}

export interface Trip {
  id: string;
  vehicle_id: string;
  driver_name: string;
  start_date: string;
  end_date: string;
  purpose: string;
  start_location: string;
  end_location: string;
  start_km: number;
  end_km: number;
  distance: number;
  created_at: string;
  // Joined data
  vehicle?: Vehicle;
}

export interface Distance {
  id: string;
  start_city: string;
  end_city: string;
  distance_km: number;
}

export interface TripFormData {
  vehicle_id: string;
  driver_name: string;
  start_date: string;
  end_date: string;
  purpose: string;
  start_location: string;
  end_location: string;
}

export interface VehicleFormData {
  name: string;
  spz: string;
  ownership: string;
  department: string;
  driver_name: string;
  acquisition_date: string;
  disposal_date: string | null;
  initial_km: number;
}

export interface TripFilters {
  month: number | null;
  year: number | null;
  vehicle_id: string | null;
  driver_name: string | null;
}

export type ViewMode = 'calendar' | 'list';

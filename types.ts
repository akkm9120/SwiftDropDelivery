export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ParcelDetails {
  pickupAddress: string;
  deliveryAddress: string;
  recipientName: string;
  recipientPhone: string;
  parcelDescription: string;
  parcelWeightKg: number; // in kilograms
  parcelLengthCm: number;
  parcelWidthCm: number;
  parcelHeightCm: number;
}

export type DeliveryStatus =
  | "pending_pickup"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "searching_driver";

export interface DeliveryRequest {
  id: string;
  parcelDetails: ParcelDetails;
  status: DeliveryStatus;
  driverId: string | null;
  userId: string;
  createdAt: string; // ISO date string
  estimatedDeliveryTime?: string; // ISO date string
  currentLocation?: Coordinates; // For tracking
}

export interface Driver {
  id: string;
  name: string;
  vehicleDetails: string; // e.g., "Blue Toyota Prius - ABC 123"
  currentLocation: Coordinates;
  rating: number; // e.g., 4.5
  phone: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

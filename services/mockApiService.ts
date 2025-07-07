
import { ParcelDetails, DeliveryRequest, Driver, Coordinates } from '../types';
import { MOCK_API_DELAY, DEFAULT_START_COORDINATES } from '../constants';

let deliveryRequests: DeliveryRequest[] = [];
let drivers: Driver[] = [
  { id: 'driver1', name: 'John Doe', vehicleDetails: 'Blue Honda Civic - XYZ 123', currentLocation: {...DEFAULT_START_COORDINATES, latitude: DEFAULT_START_COORDINATES.latitude + 0.01}, rating: 4.8, phone: '555-0101' },
  { id: 'driver2', name: 'Jane Smith', vehicleDetails: 'Red Toyota Prius - ABC 456', currentLocation: {...DEFAULT_START_COORDINATES, longitude: DEFAULT_START_COORDINATES.longitude - 0.01}, rating: 4.5, phone: '555-0102' },
  { id: 'driver3', name: 'Mike Lee', vehicleDetails: 'Silver Ford Transit - QWE 789', currentLocation: {...DEFAULT_START_COORDINATES, latitude: DEFAULT_START_COORDINATES.latitude - 0.005}, rating: 4.9, phone: '555-0103' },
];

let nextDeliveryId = 1;

export const mockSubmitDeliveryRequest = (parcelDetails: ParcelDetails, userId: string): Promise<DeliveryRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequest: DeliveryRequest = {
        id: `DR${Date.now()}${nextDeliveryId++}`,
        parcelDetails,
        status: 'searching_driver',
        driverId: null,
        userId,
        createdAt: new Date().toISOString(),
        currentLocation: { // Assume pickup location initially for simplicity
          latitude: parseFloat(parcelDetails.pickupAddress.split(',')[0]) || DEFAULT_START_COORDINATES.latitude, // very naive parsing
          longitude: parseFloat(parcelDetails.pickupAddress.split(',')[1]) || DEFAULT_START_COORDINATES.longitude,
        }
      };
      deliveryRequests.push(newRequest);
      console.log('Mock API: Submitted delivery request:', newRequest);
      resolve(newRequest);
    }, MOCK_API_DELAY);
  });
};

export const mockGetDeliveryRequestById = (requestId: string): Promise<DeliveryRequest | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = deliveryRequests.find(req => req.id === requestId);
      console.log(`Mock API: Get delivery request by ID ${requestId}:`, request);
      resolve(request);
    }, MOCK_API_DELAY / 2);
  });
};

export const mockFindDriverForRequest = (requestId: string): Promise<Driver | null> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const request = await mockGetDeliveryRequestById(requestId);
      if (request && request.status === 'searching_driver') {
        // Simple logic: pick a random available driver (first one for mock simplicity)
        // In a real app, this would involve location matching, availability, etc.
        const availableDrivers = drivers.filter(d => !deliveryRequests.some(r => r.driverId === d.id && (r.status === 'pending_pickup' || r.status === 'in_transit')));
        
        if (availableDrivers.length > 0) {
          const assignedDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
          // Update request
          const requestIndex = deliveryRequests.findIndex(r => r.id === requestId);
          if (requestIndex !== -1) {
            deliveryRequests[requestIndex] = {
              ...deliveryRequests[requestIndex],
              driverId: assignedDriver.id,
              status: 'pending_pickup', // Driver accepted, waiting for pickup
            };
            console.log(`Mock API: Driver ${assignedDriver.name} assigned to request ${requestId}`);
            resolve(assignedDriver);
            return;
          }
        }
      }
      console.log(`Mock API: No driver found or request not in searching state for ${requestId}`);
      resolve(null); // No driver found or request not in correct state
    }, MOCK_API_DELAY * 1.5);
  });
};

export const mockGetDriverById = (driverId: string): Promise<Driver | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const driver = drivers.find(d => d.id === driverId);
      console.log(`Mock API: Get driver by ID ${driverId}:`, driver);
      resolve(driver);
    }, MOCK_API_DELAY / 3);
  });
};

export const mockUpdateDriverLocation = (driverId: string, destination: Coordinates): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const driverIndex = drivers.findIndex(d => d.id === driverId);
      if (driverIndex !== -1) {
        const driver = drivers[driverIndex];
        // Simulate movement towards destination
        const latDiff = destination.latitude - driver.currentLocation.latitude;
        const lonDiff = destination.longitude - driver.currentLocation.longitude;

        const step = 0.1; // How much of the remaining distance to cover in one step

        let newLat = driver.currentLocation.latitude + latDiff * step;
        let newLon = driver.currentLocation.longitude + lonDiff * step;

        // If very close, snap to destination
        if (Math.abs(latDiff) < 0.0001 && Math.abs(lonDiff) < 0.0001) {
          newLat = destination.latitude;
          newLon = destination.longitude;
        }
        
        drivers[driverIndex].currentLocation = { latitude: newLat, longitude: newLon };
        
        // Also update the delivery request's current location if it's being tracked by this driver
        const activeRequestIndex = deliveryRequests.findIndex(req => req.driverId === driverId && (req.status === 'pending_pickup' || req.status === 'in_transit'));
        if (activeRequestIndex !== -1) {
            deliveryRequests[activeRequestIndex].currentLocation = drivers[driverIndex].currentLocation;
            if (newLat === destination.latitude && newLon === destination.longitude) {
                 deliveryRequests[activeRequestIndex].status = 'delivered';
            } else if (deliveryRequests[activeRequestIndex].status === 'pending_pickup') { // First move after pickup
                 deliveryRequests[activeRequestIndex].status = 'in_transit';
            }
        }
        
        console.log(`Mock API: Updated location for driver ${driverId}:`, drivers[driverIndex].currentLocation);
        resolve(drivers[driverIndex].currentLocation);
      } else {
        console.error(`Mock API: Driver ${driverId} not found for location update.`);
        reject(new Error("Driver not found"));
      }
    }, MOCK_API_DELAY / 2); // Faster updates for tracking
  });
};

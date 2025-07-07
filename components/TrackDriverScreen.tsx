
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeliveryRequest, Driver, Coordinates } from '../types';
import { mockGetDeliveryRequestById, mockGetDriverById, mockUpdateDriverLocation } from '../services/mockApiService';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';
import MapPlaceholder from './MapPlaceholder';
import { DEFAULT_START_COORDINATES, DEFAULT_DEST_COORDINATES } from '../constants';

// Basic SVG Icons
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);


const TrackDriverScreen: React.FC = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverLocation, setDriverLocation] = useState<Coordinates | null>(DEFAULT_START_COORDINATES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!deliveryId) {
      setError("Delivery ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const request = await mockGetDeliveryRequestById(deliveryId);
        if (!request) {
          setError(`Delivery request ${deliveryId} not found.`);
          setIsLoading(false);
          return;
        }
        setDeliveryRequest(request);

        if (request.driverId) {
          const fetchedDriver = await mockGetDriverById(request.driverId);
          if (!fetchedDriver) {
            setError(`Driver details for driver ID ${request.driverId} not found.`);
            // Continue, but driver info might be missing
          }
          setDriver(fetchedDriver);
          setDriverLocation(fetchedDriver?.currentLocation || DEFAULT_START_COORDINATES); // Initialize location
          
          // Start polling for location updates if delivery is in transit
          if (request.status === 'pending_pickup' || request.status === 'in_transit') {
            intervalRef.current = setInterval(async () => {
              const newLocation = await mockUpdateDriverLocation(request.driverId!, DEFAULT_DEST_COORDINATES); // Target destination
              setDriverLocation(newLocation);
              
              // Mock delivery completion
              if (newLocation.latitude.toFixed(4) === DEFAULT_DEST_COORDINATES.latitude.toFixed(4) && 
                  newLocation.longitude.toFixed(4) === DEFAULT_DEST_COORDINATES.longitude.toFixed(4)) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDeliveryRequest(prev => prev ? ({ ...prev, status: 'delivered', currentLocation: newLocation }) : null);
              } else {
                 setDeliveryRequest(prev => prev ? ({ ...prev, currentLocation: newLocation, status: 'in_transit' }) : null);
              }

            }, 5000); // Update every 5 seconds
          }
        } else {
          setError("No driver assigned to this delivery yet.");
          // Potentially redirect or show different UI
        }
      } catch (err) {
        console.error("Error fetching tracking data:", err);
        setError("Failed to load tracking information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Tracking Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <Button onClick={() => navigate('/dashboard')} variant="primary">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!deliveryRequest) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-700">Delivery details not available.</p>
      </div>
    );
  }

  const getStatusColor = (status: DeliveryRequest['status']) => {
    switch (status) {
      case 'pending_pickup': return 'text-yellow-600 bg-yellow-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Track Your Delivery</h1>
          <p className="text-gray-500">Delivery ID: {deliveryRequest.id}</p>
        </div>
        <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliveryRequest.status)}`}>
          Status: {deliveryRequest.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPlaceholder driverLocation={driverLocation || DEFAULT_START_COORDINATES} destinationLocation={DEFAULT_DEST_COORDINATES} />
        </div>
        
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          {driver && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Driver Details</h2>
              <div className="flex items-center space-x-3 mb-2">
                 <img src={`https://picsum.photos/seed/${driver.id}/40/40`} alt={driver.name} className="h-10 w-10 rounded-full" />
                <div>
                    <p className="font-medium text-gray-800">{driver.name}</p>
                    <p className="text-sm text-gray-500">{driver.vehicleDetails}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 flex items-center"><PhoneIcon className="h-4 w-4 mr-2 text-blue-500"/> {driver.phone}</p>
              <p className="text-sm text-gray-600">Rating: {driver.rating} ★</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Parcel Information</h3>
            <p className="text-sm text-gray-600">To: {deliveryRequest.parcelDetails.recipientName}</p>
            <p className="text-sm text-gray-600">Delivery: {deliveryRequest.parcelDetails.deliveryAddress}</p>
          </div>
          
          {driverLocation && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Current Location</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-red-500"/>
                Lat: {driverLocation.latitude.toFixed(4)}, Lon: {driverLocation.longitude.toFixed(4)}
              </p>
            </div>
          )}

          {deliveryRequest.estimatedDeliveryTime && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Estimated Delivery</h3>
              <p className="text-sm text-gray-600">{new Date(deliveryRequest.estimatedDeliveryTime).toLocaleString()}</p>
            </div>
          )}

          {deliveryRequest.status === 'delivered' && (
            <div className="mt-4 p-4 bg-green-100 rounded-md text-center">
              <p className="font-semibold text-green-700">Your parcel has been delivered!</p>
            </div>
          )}
        </div>
      </div>
       <div className="mt-8 text-center">
         <Button onClick={() => navigate('/dashboard')} variant="secondary">Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default TrackDriverScreen;

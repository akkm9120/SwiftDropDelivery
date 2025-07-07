
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { DeliveryRequest, Driver } from '../types';
import { mockFindDriverForRequest, mockGetDeliveryRequestById } from '../services/mockApiService';

// Basic SVG Icons
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


const FindDriverScreen: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing search...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setError("Delivery request ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const request = await mockGetDeliveryRequestById(requestId);
        if (request) {
          setDeliveryRequest(request);
          if (request.driverId && request.status !== 'searching_driver') { // Driver already assigned
            // Potentially fetch driver details if needed or assume they are part of the request / redirect
             navigate(`/track-driver/${request.id}`); // Assuming deliveryId is same as requestId
          } else {
             setStatusMessage('Searching for available drivers in your area...');
             searchForDriver();
          }
        } else {
          setError(`Delivery request ${requestId} not found.`);
        }
      } catch (err) {
        setError("Failed to load delivery request details.");
        console.error(err);
      } finally {
        // setIsLoading(false) is handled by searchForDriver or if error
      }
    };
    
    fetchRequestDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, navigate]);


  const searchForDriver = async () => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);

    try {
      // Simulate multiple attempts or a longer search
      for (let i = 0; i < 3; i++) { // Max 3 attempts
        setStatusMessage(`Searching... Attempt ${i + 1}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
        const foundDriver = await mockFindDriverForRequest(requestId);
        if (foundDriver) {
          setDriver(foundDriver);
          setStatusMessage(`Driver ${foundDriver.name} has accepted your request!`);
          setIsLoading(false);
          // Update delivery request status (mock)
          if(deliveryRequest) {
            setDeliveryRequest({...deliveryRequest, driverId: foundDriver.id, status: 'pending_pickup'});
          }
          return;
        }
      }
      setStatusMessage('No drivers available at the moment. Please try again later or expand your search criteria.');
      setError('Could not find a driver.');
    } catch (err) {
      console.error("Error finding driver:", err);
      setError('An error occurred while searching for a driver.');
      setStatusMessage('Search failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!deliveryRequest && !isLoading && !error) {
    return (
      <div className="text-center p-8">
        <h1 className="text-xl text-gray-700">Loading request details...</h1>
        <LoadingSpinner />
      </div>
    );
  }


  if (error) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Search Failed</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <Button onClick={() => navigate('/dashboard')} variant="primary">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {driver ? 'Driver Found!' : 'Finding Your Delivery Person'}
      </h1>
      
      {isLoading && !driver && (
        <div className="text-center space-y-4">
          <LoadingSpinner size="h-16 w-16" />
          <p className="text-lg text-blue-600 animate-pulse">{statusMessage}</p>
          <p className="text-sm text-gray-500">This might take a few moments. We appreciate your patience.</p>
        </div>
      )}

      {!isLoading && driver && deliveryRequest && (
        <div className="text-center space-y-4">
          <UserCircleIcon className="h-24 w-24 text-green-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">{driver.name}</h2>
          <p className="text-gray-600">Vehicle: {driver.vehicleDetails}</p>
          <p className="text-gray-600">Rating: {driver.rating} ★</p>
          <p className="text-green-600 font-medium">{statusMessage}</p>
          <Button onClick={() => navigate(`/track-driver/${deliveryRequest.id}`)} fullWidth variant="success">
            Track Your Delivery
          </Button>
        </div>
      )}
      
      {!isLoading && !driver && (
         <div className="text-center space-y-4">
            <SearchIcon className="h-20 w-20 text-gray-400 mx-auto" />
            <p className="text-lg text-gray-700">{statusMessage}</p>
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={searchForDriver} isLoading={isLoading} disabled={isLoading} variant="secondary">
                Retry Search
            </Button>
         </div>
      )}
    </div>
  );
};

export default FindDriverScreen;

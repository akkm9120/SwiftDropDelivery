
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import { ParcelDetails } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { mockSubmitDeliveryRequest } from '../services/mockApiService';

const RequestDeliveryScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [parcelDetails, setParcelDetails] = useState<ParcelDetails>({
    pickupAddress: '',
    deliveryAddress: '',
    recipientName: '',
    recipientPhone: '',
    parcelDescription: '',
    parcelWeightKg: 0,
    parcelLengthCm: 0,
    parcelWidthCm: 0,
    parcelHeightCm: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setParcelDetails(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!currentUser) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
    }

    try {
      // Basic validation
      if (parcelDetails.parcelWeightKg <= 0 || parcelDetails.parcelLengthCm <= 0 || parcelDetails.parcelWidthCm <= 0 || parcelDetails.parcelHeightCm <= 0) {
        throw new Error("Parcel dimensions and weight must be greater than zero.");
      }
      
      const newRequest = await mockSubmitDeliveryRequest(parcelDetails, currentUser.id);
      navigate(`/find-driver/${newRequest.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit delivery request. Please try again.');
      console.error("Delivery request failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Request a New Delivery</h1>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Parcel Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Pickup Address" name="pickupAddress" value={parcelDetails.pickupAddress} onChange={handleChange} required />
            <Input label="Delivery Address" name="deliveryAddress" value={parcelDetails.deliveryAddress} onChange={handleChange} required />
            <Input label="Recipient Name" name="recipientName" value={parcelDetails.recipientName} onChange={handleChange} required />
            <Input label="Recipient Phone" name="recipientPhone" type="tel" value={parcelDetails.recipientPhone} onChange={handleChange} required />
          </div>
        </div>

        <div>
           <label htmlFor="parcelDescription" className="block text-sm font-medium text-gray-700 mb-1">Parcel Description</label>
           <textarea
            id="parcelDescription"
            name="parcelDescription"
            rows={3}
            className="form-input block w-full sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-2"
            value={parcelDetails.parcelDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Parcel Dimensions & Weight</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Weight (kg)" name="parcelWeightKg" type="number" step="0.1" min="0.1" value={parcelDetails.parcelWeightKg.toString()} onChange={handleChange} required />
            <Input label="Length (cm)" name="parcelLengthCm" type="number" step="1" min="1" value={parcelDetails.parcelLengthCm.toString()} onChange={handleChange} required />
            <Input label="Width (cm)" name="parcelWidthCm" type="number" step="1" min="1" value={parcelDetails.parcelWidthCm.toString()} onChange={handleChange} required />
            <Input label="Height (cm)" name="parcelHeightCm" type="number" step="1" min="1" value={parcelDetails.parcelHeightCm.toString()} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="pt-4">
          <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
            Find Delivery Person
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestDeliveryScreen;

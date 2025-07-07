
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

// Basic SVG Icons
const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 8.25h3M12 3v5.25m0 0l-1.125-1.125M12 8.25l1.125-1.125M3.75 7.5h16.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path d="M3.75 4.5A.75.75 0 003 5.25v13.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H3.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5v6.75h-15V6h15v4.5zm0 0V6A2.25 2.25 0 0017.25 3.75H6.75A2.25 2.25 0 004.5 6v12A2.25 2.25 0 006.75 20.25h10.5A2.25 2.25 0 0019.5 18v-4.5M15 12H9m3-3.75A3.75 3.75 0 1012 15a3.75 3.75 0 000-7.5z" />
  </svg>
);

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {currentUser?.name || currentUser?.email}!</h1>
      <p className="text-gray-600 mb-8">What would you like to do today?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigate('/request-delivery')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-white flex flex-col items-center text-center transform hover:scale-105"
        >
          <PackageIcon className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Request a Delivery</h2>
          <p className="text-sm opacity-90">Send a parcel quickly and easily. Get quotes and find a delivery person.</p>
        </div>
        
        <div 
          onClick={() => navigate('/become-driver')}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-white flex flex-col items-center text-center transform hover:scale-105"
        >
          <TruckIcon className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Become a Delivery Person</h2>
          <p className="text-sm opacity-90">Join our network of delivery partners and start earning.</p>
        </div>
      </div>
      
      {/* Placeholder for recent activity or other dashboard widgets */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
          <p>No recent activity to display.</p>
          <p className="text-sm mt-1">Your past deliveries will show up here.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

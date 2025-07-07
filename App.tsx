
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import RequestDeliveryScreen from './components/RequestDeliveryScreen';
import FindDriverScreen from './components/FindDriverScreen';
import TrackDriverScreen from './components/TrackDriverScreen';
import BecomeDriverScreen from './components/BecomeDriverScreen';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginScreen />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/request-delivery" element={<RequestDeliveryScreen />} />
              <Route path="/find-driver/:requestId" element={<FindDriverScreen />} />
              <Route path="/track-driver/:deliveryId" element={<TrackDriverScreen />} />
              <Route path="/become-driver" element={<BecomeDriverScreen />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
            
            <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;

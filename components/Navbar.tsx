import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../constants';
import Button from './Button';

// Basic SVG Icon for User
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);


const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={currentUser ? "/dashboard" : "/login"} className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            {APP_NAME}
          </Link>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center text-gray-700">
                  <UserIcon className="h-6 w-6 mr-2 text-blue-500" />
                  <span className="hidden sm:inline">{currentUser.name || currentUser.email}</span>
                </div>
                <Button onClick={handleLogout} variant="secondary" size="sm" className="text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
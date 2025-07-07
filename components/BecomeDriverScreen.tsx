
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

// Basic SVG Icon
const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.528-1.036.926-2.185.926-3.346 0-2.986-1.55-5.64-4.096-7.07C6.024 2.512 2.25 4.092 2.25 7.5c0 1.95.772 3.799 2.148 5.168l2.496 3.03M11.42 15.17l-3.03 2.496C7.036 18.296 5.196 19 3.25 19 1.55 19 0 17.45 0 15.75c.002-.75.258-1.464.717-2.064l2.496-3.03" />
  </svg>
);


const BecomeDriverScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow-xl text-center">
      <WrenchScrewdriverIcon className="h-20 w-20 text-blue-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Become a Delivery Partner</h1>
      <p className="text-gray-600 mb-8">
        This feature is currently under development. We're excited to bring you the opportunity
        to join our network of delivery partners soon! Please check back later for updates.
      </p>
      <Button onClick={() => navigate('/dashboard')} variant="primary">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default BecomeDriverScreen;

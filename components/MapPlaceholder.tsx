
import React from 'react';
import { Coordinates } from '../types';

interface MapPlaceholderProps {
  driverLocation: Coordinates;
  destinationLocation?: Coordinates;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ driverLocation, destinationLocation }) => {
  // Simplified "distance" calculation for visual effect
  const calculateProgress = () => {
    if (!destinationLocation) return 0;
    // This is a very rough visual simulation, not geographic calculation
    const totalDiffLat = Math.abs(destinationLocation.latitude - driverLocation.latitude);
    const totalDiffLon = Math.abs(destinationLocation.longitude - driverLocation.longitude);
    // Assuming starting point was further away, closer to 0,0 for simplicity if not set
    const initialLat = destinationLocation.latitude > 0 ? 0 : destinationLocation.latitude * 2;
    const initialLon = destinationLocation.longitude > 0 ? 0 : destinationLocation.longitude * 2;

    const maxDist = Math.sqrt(Math.pow(destinationLocation.latitude - initialLat, 2) + Math.pow(destinationLocation.longitude - initialLon, 2));
    const currentDist = Math.sqrt(Math.pow(totalDiffLat, 2) + Math.pow(totalDiffLon, 2));
    
    if (maxDist === 0) return 100; // Already at destination
    const progress = Math.max(0, Math.min(100, (1 - currentDist / maxDist) * 100));
    return progress;
  };

  const progress = calculateProgress();

  // Position driver icon - very simplified logic, not to scale
  // Assuming a 100x100 grid for simplicity
  const driverX = (driverLocation.longitude + 180) / 360 * 100; // Normalize longitude to 0-100
  const driverY = (90 - driverLocation.latitude) / 180 * 100;   // Normalize latitude to 0-100 (inverted for top-left origin)
  
  const destX = destinationLocation ? (destinationLocation.longitude + 180) / 360 * 100 : 50;
  const destY = destinationLocation ? (90 - destinationLocation.latitude) / 180 * 100 : 50;


  return (
    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg shadow-inner overflow-hidden relative border-2 border-gray-300">
      <div 
        className="absolute w-full h-full bg-cover bg-center opacity-30" 
        style={{backgroundImage: "url('https://picsum.photos/800/600?blur=2&grayscale&random=map')"}}
      ></div>
      
      {/* Mocked Route Line (Very basic) */}
      {destinationLocation && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line 
            x1={driverX < 50 ? driverX -5 : driverX + 5} /* start point near center for visual */
            y1={driverY < 50 ? driverY -5 : driverY + 5} 
            x2={destX} 
            y2={destY} 
            stroke="#60a5fa" 
            strokeWidth="1" 
            strokeDasharray="2 2" 
          />
        </svg>
      )}

      {/* Driver Icon */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
        style={{ left: `${driverX}%`, top: `${driverY}%` }}
        title={`Driver: Lat ${driverLocation.latitude.toFixed(2)}, Lon ${driverLocation.longitude.toFixed(2)}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600 drop-shadow-lg">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM22.5 13.5h-9v8.25c0 1.035-.84 1.875-1.875 1.875h-1.5A1.875 1.875 0 0 1 8.25 21.75V13.5H1.5V15c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V13.5Z" />
        </svg>
      </div>

      {/* Destination Icon */}
      {destinationLocation && (
         <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${destX}%`, top: `${destY}%` }}
            title={`Destination: Lat ${destinationLocation.latitude.toFixed(2)}, Lon ${destinationLocation.longitude.toFixed(2)}`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500 drop-shadow-lg">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a2.25 2.25 0 001.286-2.45M12 2.25a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
              <path d="M12.025 2.267c1.139 0 2.23.295 3.197.858 1.099.648 1.905 1.56 2.375 2.682C18.667 8.018 18 10.317 18 12.75s.667 4.732 1.597 6.943c-.47 1.121-1.276 2.034-2.375 2.682a7.482 7.482 0 01-3.197.859 7.482 7.482 0 01-3.197-.859c-1.099-.648-1.905-1.56-2.375-2.682C4.333 17.482 3.667 15.183 3.667 12.75s-.666-4.732-1.597-6.943c.47-1.121 1.276-2.034 2.375-2.682A7.482 7.482 0 018.828 2.267h3.197zM12 14.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
         </div>
      )}
      
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 p-2 rounded text-xs text-gray-700">
        Map Area (Simulation) <br/>
        Driver: Lat {driverLocation.latitude.toFixed(2)}, Lon {driverLocation.longitude.toFixed(2)} <br/>
        Progress: {progress.toFixed(0)}% (Visual Only)
      </div>
    </div>
  );
};

export default MapPlaceholder;

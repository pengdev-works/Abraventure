import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import Swal from 'sweetalert2';

const Spots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpots = async () => {
      // First, don't show the alert immediately. Wait a moment to see if it's a fast request
      let alertTimer;
      if (spots.length === 0) {
        alertTimer = setTimeout(() => {
          Swal.fire({
            title: 'Waking up Server...',
            html: 'Loading destinations. This may take up to <b>50 seconds</b> on the first visit.',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        }, 1500); // Only show if it takes more than 1.5 seconds
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/spots`);
        setSpots(response.data);
      } catch (err) {
        console.error('Error fetching spots:', err);
        setError('Failed to load tourist spots. Please try again later.');
      } finally {
        if (alertTimer) clearTimeout(alertTimer);
        Swal.close();
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans tracking-tight">Discover <span className="text-nature-600">Tourist Spots</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the breathtaking natural wonders and heritage sites of Abra, preserved by local communities.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl border border-red-100">{error}</div>
      ) : spots.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-lg font-medium text-gray-800">No tourist spots available yet.</p>
          <p className="text-sm">The Provincial Tourism Office will add incredible destinations here soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spots.map((spot) => (
            <DestinationCard 
              key={spot.id} 
              item={spot} 
              type="spot" 
              // No actionable button for spots in this MVP, just display
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Spots;

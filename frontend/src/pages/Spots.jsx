import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import HeroBanner from '../components/HeroBanner';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search, Map as MapIcon, Grid } from 'lucide-react';
import Swal from 'sweetalert2';
import MapContainer from '../components/MapContainer';

const Spots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

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

  const filteredSpots = spots.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.location && s.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner 
        title="Discover Tourist Spots" 
        subtitle="Explore the breathtaking natural wonders and heritage sites of Abra, preserved by local communities." 
        bgClass="from-nature-900 to-nature-700" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Search Bar */}
        <div className="mb-10 max-w-xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search spots by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none text-gray-700 transition-all"
          />
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                viewMode === 'grid' 
                  ? 'bg-nature-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-5 h-5" /> Grid View
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                viewMode === 'map' 
                  ? 'bg-nature-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <MapIcon className="w-5 h-5" /> Interactive Map
            </button>
          </div>
        </div>

      {loading ? (
        <div className="py-10">
          <GridSkeleton count={6} />
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
          {filteredSpots.length > 0 ? (
            viewMode === 'grid' ? (
              filteredSpots.map((spot) => (
                <DestinationCard 
                  key={spot.id} 
                  item={spot} 
                  type="spot" 
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <MapContainer 
                  markers={filteredSpots} 
                  height="600px" 
                  zoom={10} 
                  interactive={true} 
                />
                <p className="mt-4 text-center text-gray-500 text-sm italic">
                  Tip: Click on markers to view destination details and nearby homestays.
                </p>
              </div>
            )
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              No tourist spots match your search.
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Spots;

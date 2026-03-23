import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import InquiryModal from '../components/InquiryModal';
import HeroBanner from '../components/HeroBanner';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';

const Homestays = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHomestays = async () => {
      let alertTimer;
      if (homestays.length === 0) {
        alertTimer = setTimeout(() => {
          Swal.fire({
            title: 'Waking up Server...',
            html: 'Loading homestays. This may take up to <b>50 seconds</b> on the first visit.',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        }, 1500);
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/homestays`);
        setHomestays(response.data);
      } catch (err) {
        console.error('Error fetching homestays:', err);
        setError('Failed to load homestays. Please try again later.');
      } finally {
        if (alertTimer) clearTimeout(alertTimer);
        Swal.close();
        setLoading(false);
      }
    };

    fetchHomestays();
  }, []);

  const handleBookNow = (homestay) => {
    setSelectedHomestay(homestay);
    setIsModalOpen(true);
  };

  const filteredHomestays = homestays.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.location && h.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner 
        title="Certified Homestays" 
        subtitle="Experience authentic Abra culture by staying with local families in comfortable, verified accommodations." 
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
            placeholder="Search homestays by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none text-gray-700 transition-all"
          />
        </div>

      {loading ? (
        <div className="py-10">
          <GridSkeleton count={6} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl border border-red-100">{error}</div>
      ) : homestays.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          No homestays available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHomestays.length > 0 ? (
            filteredHomestays.map((homestay) => (
              <DestinationCard 
                key={homestay.id} 
                item={homestay} 
                type="homestay" 
                onActionClick={handleBookNow} 
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              No homestays match your search. Try different keywords.
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <InquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        targetItem={selectedHomestay} 
        type="homestay" 
      />
      </div>
    </div>
  );
};

export default Homestays;

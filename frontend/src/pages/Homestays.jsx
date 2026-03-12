import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import InquiryModal from '../components/InquiryModal';

const Homestays = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState(null);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/homestays`);
        setHomestays(response.data);
      } catch (err) {
        console.error('Error fetching homestays:', err);
        setError('Failed to load homestays. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, []);

  const handleBookNow = (homestay) => {
    setSelectedHomestay(homestay);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans tracking-tight">Certified <span className="text-nature-600">Homestays</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience authentic Abra culture by staying with local families in comfortable, verified accommodations.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl border border-red-100">{error}</div>
      ) : homestays.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          No homestays available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homestays.map((homestay) => (
            <DestinationCard 
              key={homestay.id} 
              item={homestay} 
              type="homestay" 
              onActionClick={handleBookNow} 
            />
          ))}
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
  );
};

export default Homestays;

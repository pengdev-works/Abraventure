import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import InquiryModal from '../components/InquiryModal';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/guides`);
        setGuides(response.data);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load accredited guides. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleContactGuide = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans tracking-tight">Accredited <span className="text-earth-600">Local Guides</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with DOT-accredited and local expert guides for a safe, informative, and culturally respectful journey.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl border border-red-100">{error}</div>
      ) : guides.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-lg font-medium text-gray-800">No guides available yet.</p>
          <p className="text-sm">The Provincial Tourism Office is currently accrediting local guides.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <DestinationCard 
              key={guide.id} 
              item={guide} 
              type="guide" 
              onActionClick={handleContactGuide} 
            />
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <InquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        targetItem={selectedGuide} 
        type="guide" 
      />
    </div>
  );
};

export default Guides;

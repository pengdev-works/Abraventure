import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import InquiryModal from '../components/InquiryModal';
import HeroBanner from '../components/HeroBanner';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      let alertTimer;
      if (guides.length === 0) {
        alertTimer = setTimeout(() => {
          Swal.fire({
            title: 'Waking up Server...',
            html: 'Loading guides. This may take up to <b>50 seconds</b> on the first visit.',
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
        const response = await axios.get(`${apiUrl}/guides`);
        setGuides(response.data);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load accredited guides. Please try again later.');
      } finally {
        if (alertTimer) clearTimeout(alertTimer);
        Swal.close();
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleContactGuide = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  const filteredGuides = guides.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (g.accreditation_level && g.accreditation_level.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner 
        title="Accredited Local Guides" 
        subtitle="Connect with DOT-accredited and local expert guides for a safe, informative, and culturally respectful journey." 
        bgClass="from-earth-900 to-earth-700" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Search Bar */}
        <div className="mb-10 max-w-xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search guides by name or accreditation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none text-gray-700 transition-all"
          />
        </div>

      {loading ? (
        <div className="py-10">
          <GridSkeleton count={6} />
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
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <DestinationCard 
                key={guide.id} 
                item={guide} 
                type="guide" 
                onActionClick={handleContactGuide} 
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              No guides match your search.
            </div>
          )}
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
    </div>
  );
};

export default Guides;

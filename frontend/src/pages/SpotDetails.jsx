import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, ArrowLeft, Tent, Users, Map as MapIcon } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';
import MapContainer from '../components/MapContainer';

const SpotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [spot, setSpot] = useState(null);
  const [homestays, setHomestays] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);
  const [modalType, setModalType] = useState('homestay');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const [spotRes, homestaysRes, guidesRes] = await Promise.all([
          axios.get(`${apiUrl}/spots/${id}`),
          axios.get(`${apiUrl}/homestays`),
          axios.get(`${apiUrl}/guides`)
        ]);
        
        setSpot(spotRes.data);
        
        // Filter homestays and guides to only those in the same location
        const targetLocation = spotRes.data.location;
        const localHomestays = homestaysRes.data.filter(h => h.location === targetLocation);
        const localGuides = guidesRes.data.filter(g => g.location === targetLocation);
        
        setHomestays(localHomestays);
        setGuides(localGuides);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const openModal = (item, type) => {
    setModalTarget(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin mb-4"></div>
          <p className="text-nature-600 font-medium">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen pt-20 flex flex-col justify-center items-center bg-gray-50 text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Destination Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">The tourist spot you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/spots')} className="bg-nature-600 text-white px-6 py-3 rounded-full hover:bg-nature-700 transition">
          Back to Tourist Spots
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-nature-900">
        <img 
          src={spot.image_url || 'https://images.unsplash.com/photo-1542224566-6e85f2e10ce3'} 
          alt={spot.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="absolute top-24 left-4 md:left-8 z-10">
          <button 
            onClick={() => navigate('/spots')}
            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Destinations
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1 text-nature-200 font-medium tracking-wider uppercase text-sm mb-3">
                <MapPin className="w-4 h-4" /> {spot.location}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                {spot.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mb-12">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2">
               <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">About this Destination</h2>
               <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                 {spot.description}
               </p>
             </div>
             
             {spot.directions && (
               <div className="bg-nature-50 rounded-2xl p-8 border border-nature-100">
                 <h3 className="text-xl font-bold text-nature-900 mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                   How to Get Here
                 </h3>
                 <p className="text-nature-800 text-sm leading-relaxed whitespace-pre-line italic">
                   {spot.directions}
                 </p>
               </div>
             )}
           </div>
        </div>

        {/* Mini Map Section */}
        {spot.latitude && spot.longitude && (
          <div className="bg-white rounded-3xl shadow-lg p-1 border border-gray-100 mb-12 overflow-hidden h-[400px]">
            <MapContainer 
              markers={[spot]} 
              center={{ lat: parseFloat(spot.latitude), lng: parseFloat(spot.longitude) }} 
              zoom={13} 
              height="100%" 
              interactive={false} 
            />
          </div>
        )}

        {/* Recommended Homestays Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-nature-100 rounded-xl flex items-center justify-center text-nature-600">
              <Tent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Where to Stay Nearby</h3>
              <p className="text-gray-500">Certified homestays located in <span className="text-nature-600 font-bold">{spot.location}</span>.</p>
            </div>
          </div>
          
          {homestays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homestays.map((homestay) => (
                <div key={homestay.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                  <div className="h-48 w-full bg-gray-200 relative">
                    <img 
                      src={homestay.image_url || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'} 
                      alt={homestay.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-nature-700">
                      ₱{homestay.price_per_night} / night
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{homestay.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{homestay.description}</p>
                    <button 
                      onClick={() => openModal(homestay, 'homestay')}
                      className="w-full py-2.5 bg-nature-50 hover:bg-nature-600 text-nature-700 hover:text-white border border-nature-200 hover:border-transparent rounded-xl font-medium transition-colors"
                    >
                      Book Homestay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
              <p className="text-orange-700 font-medium italic">No homestays currently registered in {spot.location}.</p>
              <p className="text-orange-600 text-sm mt-1">Please check other municipalities for accommodation options.</p>
            </div>
          )}
        </div>

        {/* Available Guides Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center text-earth-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Local Experts</h3>
              <p className="text-gray-500">Certified guides serving the <span className="text-earth-600 font-bold">{spot.location}</span> area.</p>
            </div>
          </div>
          
          {guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row items-center p-6 gap-6">
                  <img 
                    src={guide.image_url || 'https://images.unsplash.com/photo-1544168190-79c15427015f'} 
                    alt={guide.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-earth-100"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold text-gray-900">{guide.name}</h3>
                    <span className="inline-block px-3 py-1 bg-earth-50 text-earth-700 text-xs font-semibold rounded-full mt-1 mb-3">
                      {guide.accreditation_level}
                    </span>
                    <button 
                      onClick={() => openModal(guide, 'guide')}
                      className="block w-full text-center py-2 bg-earth-600 hover:bg-earth-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Hire Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-earth-50 border border-earth-100 rounded-2xl p-8 text-center">
              <p className="text-earth-700 font-medium italic">No local guides specifically registered for {spot.location} yet.</p>
              <p className="text-earth-600 text-sm mt-1">Visit the "Tour Guides" page to see our full list of Abra-wide experts.</p>
            </div>
          )}
        </div>

      </div>

      {/* Booking Form Modal */}
      <InquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        targetItem={modalTarget} 
        type={modalType} 
      />
    </div>
  );
};

export default SpotDetails;

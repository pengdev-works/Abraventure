import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import InquiryModal from '../components/InquiryModal';
import HeroBanner from '../components/HeroBanner';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search, Home as HomeIcon, Star, Filter, Coffee, Wifi } from 'lucide-react';

const Homestays = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/homestays`);
        setHomestays(response.data);
      } catch (err) {
        console.error('Error fetching homestays:', err);
        setError('Accommodation network synchronization failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchHomestays();
  }, []);

  const handleBookHomestay = (homestay) => {
    setSelectedHomestay(homestay);
    setIsModalOpen(true);
  };

  const filteredHomestays = homestays.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.location && h.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-nature-50/20">
      <HeroBanner 
        title="Community Sanctuaries" 
        subtitle="Experience authentic Abrenian hospitality. Belong to a local family, share their stories, and live the true rhythm of life in the North." 
        bgClass="from-nature-950 via-nature-900 to-nature-800" 
      />

      <div className="max-w-7xl mx-auto px-6 py-20 w-full space-y-24">
        
        {/* Adjudication Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
           <div className="flex-1 w-full max-w-2xl relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-nature-600">
                <Search size={20} className="group-focus-within:scale-110 transition-transform" />
              </div>
              <input
                type="text"
                placeholder="Search by homestay name or municipal node..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white rounded-[2rem] border-none shadow-xl shadow-nature-900/5 focus:ring-4 focus:ring-nature-500/10 outline-none text-gray-700 font-bold transition-all text-sm"
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-[1.5rem] shadow-xl shadow-nature-900/5 border border-gray-50">
                 <div className="flex -space-x-1">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-nature-100 border-2 border-white"></div>)}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Verified Hosts</span>
              </div>
              <button className="p-4 bg-white rounded-2xl text-gray-400 hover:text-nature-600 shadow-xl transition-all"><Filter size={20}/></button>
           </div>
        </div>

        {loading ? (
          <div className="py-20">
            <GridSkeleton count={6} />
          </div>
        ) : error ? (
          <div className="text-center py-40 bg-red-50 rounded-[4rem] border border-red-100/50">
             <HomeIcon size={64} className="mx-auto mb-6 text-red-300 animate-pulse" />
             <p className="text-red-900 font-black text-xl uppercase tracking-widest leading-none mb-2">Network Error</p>
             <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : homestays.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-nature-100">
            <HomeIcon size={64} className="mx-auto mb-6 text-gray-100" />
            <h3 className="text-gray-800 font-black text-2xl uppercase tracking-widest">Awaiting Listings</h3>
            <p className="text-gray-400 font-medium mt-4">Local municipal units are currently certifying new community homestays.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredHomestays.length > 0 ? (
                filteredHomestays.map((homestay) => (
                  <DestinationCard 
                    key={homestay.id} 
                    item={homestay} 
                    type="homestay" 
                    onActionClick={handleBookHomestay} 
                  />
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                   <p className="text-gray-300 font-black text-4xl uppercase tracking-[0.2em]">No Sanctuary Found</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Hospitality Principles */}
        <section className="bg-nature-950 p-12 md:p-24 rounded-[5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-nature-400/5 rounded-full blur-[120px] -mr-64 -mt-64 transition-all group-hover:bg-nature-400/10"></div>
           <div className="relative z-10 flex flex-col lg:flex-row gap-20 items-center">
              <div className="flex-1 text-left">
                 <span className="text-nature-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Sanctuary Standards</span>
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[1.1] italic">Not just a room. <span className="text-nature-400 underline decoration-nature-800 underline-offset-8">A family.</span></h2>
                 <p className="text-nature-100/60 text-xl leading-relaxed font-medium mb-12 max-w-2xl">Our homestays prioritize authentic cultural exchange over mass tourism. Every stay directly supports the local household and municipality, ensuring sustainable growth for the community.</p>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Coffee className="text-nature-400 w-8 h-8 mb-4" />
                       <h4 className="text-white font-black uppercase text-xs tracking-widest">Local Breakfast</h4>
                       <p className="text-nature-200/40 text-sm">Included in every stay.</p>
                    </div>
                    <div className="space-y-2">
                       <Wifi className="text-nature-400 w-8 h-8 mb-4" />
                       <h4 className="text-white font-black uppercase text-xs tracking-widest">Basic Connectivity</h4>
                       <p className="text-nature-200/40 text-sm">Available in most areas.</p>
                    </div>
                 </div>
              </div>
              <div className="w-full lg:w-96 aspect-[3/4] rounded-[4rem] bg-nature-900 border border-nature-800 shadow-2xl relative overflow-hidden group-hover:-rotate-3 transition-transform duration-700">
                 <img src="https://images.unsplash.com/photo-1542224566-6e85f2e10ce3" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" alt="hospitality" />
                 <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-nature-950 to-transparent">
                    <Star className="text-yellow-400 fill-yellow-400 mb-4" />
                    <p className="text-white font-serif italic text-xl">"The warmth of the family in Bangued made us feel as if we had returned home to ourselves."</p>
                    <p className="text-nature-400 font-black uppercase text-[10px] tracking-widest mt-4">— European Traveler, 2025</p>
                 </div>
              </div>
           </div>
        </section>
      </div>

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

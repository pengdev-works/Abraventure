import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import InquiryModal from '../components/InquiryModal';
import HeroBanner from '../components/HeroBanner';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search, Shield, Filter, Compass, Users as UsersIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/guides`);
        setGuides(response.data);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Accreditation database is currently unavailable.');
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

  const filteredGuides = guides.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (g.accreditation_level && g.accreditation_level.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (g.location && g.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-earth-50/30">
      <HeroBanner 
        title="Institutional Experts" 
        subtitle="Connect with DOT-accredited protocols and ancestral knowledge keepers for a safe, culturally immersive journey into the heart of Abra." 
        bgClass="from-earth-950 via-earth-900 to-earth-800" 
      />

      <div className="max-w-7xl mx-auto px-6 py-20 w-full space-y-20">
        
        {/* Adjudication Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
           <div className="flex-1 w-full max-w-2xl relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-earth-600">
                <Search size={20} className="group-focus-within:scale-110 transition-transform" />
              </div>
              <input
                type="text"
                placeholder="Search by guide identity or municipal specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white rounded-[2rem] border-none shadow-xl shadow-earth-900/5 focus:ring-4 focus:ring-earth-500/10 outline-none text-gray-700 font-bold transition-all text-sm"
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white px-6 py-4 rounded-[1.5rem] shadow-xl shadow-earth-900/5 border border-gray-50">
                 <Shield size={20} className="text-earth-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">100% Accredited</span>
              </div>
              <button className="p-4 bg-white rounded-2xl text-gray-400 hover:text-earth-600 shadow-xl transition-all"><Filter size={20} /></button>
           </div>
        </div>

        {loading ? (
          <div className="py-20">
            <GridSkeleton count={6} />
          </div>
        ) : error ? (
          <div className="text-center py-40 bg-red-50 rounded-[4rem] border border-red-100/50">
             <Compass size={64} className="mx-auto mb-6 text-red-300 animate-pulse" />
             <p className="text-red-900 font-black text-xl uppercase tracking-widest leading-none mb-2">Service Disruption</p>
             <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-earth-100">
            <UsersIcon size={64} className="mx-auto mb-6 text-gray-100" />
            <h3 className="text-gray-800 font-black text-2xl uppercase tracking-widest">Enrollment Phase</h3>
            <p className="text-gray-400 font-medium mt-4">New institutional guides are currently undergoing seasonal accreditation.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                <div className="col-span-full py-40 text-center">
                   <p className="text-gray-300 font-black text-4xl uppercase tracking-[0.2em]">Zero Matches Found</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Verification Standards */}
        <section className="bg-earth-950 p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-earth-400/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-colors"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-center">
              <div className="lg:col-span-2 text-left">
                 <span className="text-earth-400 font-black uppercase tracking-widest text-[10px] mb-4 block leading-none">Trust Protocols</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 italic leading-none whitespace-pre-line">Verified Human {"\n"}<span className="text-earth-400">Excellence.</span></h2>
                 <p className="text-earth-100/60 text-lg leading-relaxed font-medium max-w-2xl">Every guide listed in this portal has completed strict DOT-accredited training and cultural sensitivity orientation to ensure your experience respects local Abrenian standards.</p>
              </div>
              <div className="flex flex-col gap-4">
                 {[
                   { label: 'Safety Certified', icon: <Shield size={16}/> },
                   { label: 'Cultural Sensitivity', icon: <Compass size={16}/> },
                   { label: 'Emergency Response', icon: <Shield size={16}/> }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm group-hover:bg-white/10 transition-all">
                      <div className="text-earth-400">{item.icon}</div>
                      <span className="text-white font-black uppercase text-[10px] tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>

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

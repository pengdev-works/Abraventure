import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, ArrowLeft, ArrowRight, Tent, Users, Navigation, Compass, ShieldCheck, ChevronRight, Share2, Heart, Info, Map as MapIcon } from 'lucide-react';
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
        const targetLocation = spotRes.data.location;
        setHomestays(homestaysRes.data.filter(h => h.location === targetLocation));
        setGuides(guidesRes.data.filter(g => g.location === targetLocation));
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const openModal = (item, type) => {
    setModalTarget(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-nature-200 border-t-nature-600 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-nature-100 border-b-nature-400 animate-spin-reverse delay-150"></div>
        </div>
        <p className="text-nature-700 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Geographical Intelligence...</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-4">
        <Compass size={80} className="text-gray-200 mb-8" />
        <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter italic">Coordinate Lost.</h2>
        <p className="text-gray-500 mb-10 max-w-sm font-medium">The institutional record for this destination has been purged or relocated.</p>
        <button onClick={() => navigate('/spots')} className="bg-nature-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-nature-900/40 hover:scale-105 transition-all outline-none">
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-40 selection:bg-nature-100 selection:text-nature-900">
      {/* Immersive Cinematic Hero */}
      <section className="relative h-[85vh] w-full flex items-end overflow-hidden group">
        <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-linear">
          <img 
            src={spot.image_url || 'https://images.unsplash.com/photo-1542224566-6e85f2e10ce3'} 
            alt={spot.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/20 to-transparent z-10"></div>
        
        {/* Navigation Overlays */}
        <div className="absolute top-32 left-8 md:left-12 lg:left-24 z-30">
          <button 
            onClick={() => navigate('/spots')}
            className="flex items-center gap-3 text-white/80 hover:text-white bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all hover:pl-4 shadow-2xl"
          >
            <ArrowLeft size={16} /> Hub Discovery
          </button>
        </div>

        <div className="absolute top-32 right-8 md:right-12 lg:right-24 z-30 flex items-center gap-4">
           <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-nature-900 transition-all shadow-2xl"><Heart size={20}/></button>
           <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-nature-900 transition-all shadow-2xl"><Share2 size={20}/></button>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-24 pb-20 text-left">
           <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                 <span className="bg-nature-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-nature-600/40">Verified Sanctuary</span>
                 <div className="flex items-center gap-2 text-nature-200 text-xs font-black uppercase tracking-widest backdrop-blur-md bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    <MapPin size={14} /> {spot.location}
                 </div>
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none italic animate-fade-in-up">
                {spot.name}<span className="text-nature-400">.</span>
              </h1>
              <p className="text-nature-50/60 max-w-3xl text-lg md:text-xl font-medium leading-relaxed drop-shadow-lg">
                 Part of the ancestral municipality of {spot.location}, this destination represents the unblemished geographical heritage of the Abrenian people.
              </p>
           </div>
        </div>
      </section>

      {/* Magazine Layout Body */}
      <section className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24 -mt-20 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Narrative Content */}
          <div className="lg:col-span-8 space-y-20">
             <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl shadow-nature-900/5 border border-gray-50 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-nature-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 space-y-12">
                   <div className="space-y-6">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight italic flex items-center gap-4">
                         <div className="w-10 h-1 rounded-full bg-nature-600"></div> Narrative Intelligence
                      </h2>
                      <p className="text-gray-500 font-medium text-xl leading-[1.8] whitespace-pre-line first-letter:text-7xl first-letter:font-black first-letter:text-nature-600 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-2">
                        {spot.description}
                      </p>
                   </div>

                   {spot.directions && (
                      <div className="pt-12 border-t border-gray-100 space-y-6">
                         <h3 className="text-2xl font-black text-gray-900 tracking-tight italic flex items-center gap-4">
                            <Navigation size={24} className="text-nature-600" /> Geographical Access
                         </h3>
                         <div className="bg-nature-50/50 p-10 rounded-[3rem] border border-nature-100/50">
                            <p className="text-nature-900 font-medium italic text-lg leading-relaxed">{spot.directions}</p>
                         </div>
                      </div>
                   )}
                </div>
             </div>

             {/* Local Resource Modules */}
             <div className="space-y-20">
                {/* Homestays Section */}
                <div className="space-y-12">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-10">
                      <div className="text-left">
                         <span className="text-nature-600 font-black uppercase text-[10px] tracking-widest block mb-1">Accommodation Network</span>
                         <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic">Local <span className="text-nature-600">Sanctuaries</span></h3>
                      </div>
                      <button onClick={() => navigate('/homestays')} className="flex items-center gap-2 text-nature-800 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">Expand Discovery <ChevronRight size={16}/></button>
                   </div>
                   
                   {homestays.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {homestays.map((homestay) => (
                           <div key={homestay.id} className="bg-gray-50 p-6 rounded-[3rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                              <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-8">
                                 <img src={homestay.image_url || 'https://images.unsplash.com/photo-1542224566-6e85f2e10ce3'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={homestay.name} />
                                 <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-nature-900 font-black text-sm tracking-tighter shadow-xl">
                                    ₱{homestay.price_per_night} / Node
                                 </div>
                              </div>
                              <div className="px-4 pb-4 text-left">
                                 <h4 className="text-2xl font-black text-gray-900 mb-2 truncate">{homestay.name}</h4>
                                 <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">{homestay.description}</p>
                                 <button onClick={() => openModal(homestay, 'homestay')} className="w-full bg-white border border-gray-100 hover:bg-nature-900 hover:text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-sm">Initiate Booking</button>
                              </div>
                           </div>
                        ))}
                      </div>
                   ) : (
                      <div className="mx-10 p-16 bg-nature-50/50 rounded-[4rem] border border-nature-100 border-dashed text-center">
                         <p className="text-nature-900/40 font-black uppercase tracking-widest text-xs">No local sanctuaries confirmed in this node yet.</p>
                      </div>
                   )}
                </div>

                {/* Guides Section */}
                <div className="space-y-12">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-10">
                      <div className="text-left">
                         <span className="text-earth-600 font-black uppercase text-[10px] tracking-widest block mb-1">Expert Network</span>
                         <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic">Institutional <span className="text-earth-600">Guides</span></h3>
                      </div>
                   </div>
                   
                   {guides.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {guides.map((guide) => (
                           <div key={guide.id} className="bg-earth-50/50 p-8 rounded-[3.5rem] border border-earth-100 flex items-center gap-8 group hover:bg-earth-100/50 transition-all">
                              <div className="w-24 h-24 rounded-[2rem] overflow-hidden shrink-0 border-4 border-white shadow-xl">
                                 <img src={guide.image_url || 'https://i.pravatar.cc/300'} className="w-full h-full object-cover" alt={guide.name} />
                              </div>
                              <div className="flex-1 text-left">
                                 <span className="text-earth-600 font-black uppercase text-[10px] tracking-widest leading-none mb-2 block">{guide.accreditation_level}</span>
                                 <h4 className="text-2xl font-black text-gray-900 mb-6 truncate leading-none">{guide.name}</h4>
                                 <button onClick={() => openModal(guide, 'guide')} className="bg-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-earth-800 shadow-sm hover:bg-earth-900 hover:text-white transition-all">Consult Expert</button>
                              </div>
                           </div>
                        ))}
                      </div>
                   ) : (
                      <div className="mx-10 p-16 bg-earth-50/30 rounded-[4rem] border border-earth-100 border-dashed text-center">
                         <p className="text-earth-900/40 font-black uppercase tracking-widest text-xs">Awaiting local expert certification for this municipality.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Institutional Sidebar Detail */}
          <div className="lg:col-span-4 space-y-12">
             <div className="bg-nature-950 p-10 py-12 rounded-[4rem] shadow-2xl shadow-nature-900/20 text-left sticky top-32">
                <div className="space-y-10">
                   <div className="space-y-4">
                      <span className="text-nature-400 font-black uppercase tracking-[0.3em] text-[10px] block leading-none">Security Node</span>
                      <h4 className="text-3xl font-black text-white italic tracking-tighter leading-none">Sanctuary <span className="text-nature-400">Protocols</span></h4>
                      <p className="text-nature-100/40 text-sm font-medium leading-relaxed">This destination is governed by municipal ecological codes. Adherence to these standards is mandatory for all institutional visitors.</p>
                   </div>
                   
                   <div className="space-y-6">
                      {[
                        { label: 'Accredited Hub', icon: <ShieldCheck size={18}/> },
                        { label: 'Ecological Heritage', icon: <Compass size={18}/> },
                        { label: 'Community Governed', icon: <Users size={18}/> }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                           <div className="text-nature-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                           <span className="text-white font-black uppercase text-[10px] tracking-widest">{item.label}</span>
                        </div>
                      ))}
                   </div>

                   <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="w-full bg-nature-600 text-white font-black py-6 rounded-[2rem] text-xs uppercase tracking-widest shadow-2xl shadow-nature-600/40 hover:bg-nature-500 transition-all flex items-center justify-center gap-3">
                      View Visual Intelligence <ArrowRight size={18}/>
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Full Perspective Map */}
        <div className="mt-40 space-y-12">
            <div className="text-center">
               <span className="text-nature-600 font-black uppercase tracking-widest text-[10px] block mb-2">Geospatial Awareness</span>
               <h3 className="text-5xl font-black text-gray-900 tracking-tighter italic leading-none">Institutional <span className="text-nature-600">Mapping</span></h3>
            </div>
            {spot.latitude && spot.longitude && (
              <div className="bg-nature-50 rounded-[5rem] shadow-2xl p-4 border border-white overflow-hidden h-[600px] relative">
                <MapContainer 
                  markers={[spot]} 
                  center={{ lat: parseFloat(spot.latitude), lng: parseFloat(spot.longitude) }} 
                  zoom={14} 
                  height="100%" 
                  interactive={true} 
                />
              </div>
            )}
        </div>
      </section>

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

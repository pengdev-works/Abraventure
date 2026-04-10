import { useState, useEffect } from 'react';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import HeroBanner from '../components/HeroBanner';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search, Map as MapIcon, Grid, Filter, MapPin, Compass } from 'lucide-react';
import Swal from 'sweetalert2';
import MapContainer from '../components/MapContainer';

const Spots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/spots`);
        setSpots(response.data);
      } catch (err) {
        console.error('Error fetching spots:', err);
        setError('Connection to Provincial Tourism Database interrupted.');
      } finally {
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
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <HeroBanner 
        title="Institutional Discovery" 
        subtitle="Explore the unblemished natural wonders and ancestral heritage sites of Abra, preserved through community-led tourism protocols." 
        bgClass="from-nature-950 via-nature-900 to-nature-800" 
      />

      <div className="max-w-7xl mx-auto px-6 py-20 w-full space-y-20">
        
        {/* Navigation & Adjudication Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
           <div className="flex-1 w-full max-w-2xl relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-nature-600">
                <Search size={20} className="group-focus-within:scale-110 transition-transform" />
              </div>
              <input
                type="text"
                placeholder="Search by destination name or municipal node..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white rounded-[2rem] border-none shadow-xl shadow-nature-900/5 focus:ring-4 focus:ring-nature-500/10 outline-none text-gray-700 font-bold transition-all text-sm"
              />
           </div>

           <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-xl shadow-nature-900/5 border border-gray-50">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-nature-900 text-white shadow-lg shadow-nature-900/20' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <Grid size={16} /> Grid Gallery
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                  viewMode === 'map' 
                    ? 'bg-nature-900 text-white shadow-lg shadow-nature-900/20' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <MapIcon size={16} /> Interactive Map
              </button>
           </div>
        </div>

        {loading ? (
          <div className="py-20">
            <GridSkeleton count={6} />
          </div>
        ) : error ? (
          <div className="text-center py-40 bg-red-50 rounded-[4rem] border border-red-100/50">
             <Compass size={64} className="mx-auto mb-6 text-red-300 animate-pulse" />
             <p className="text-red-900 font-black text-xl uppercase tracking-widest leading-none mb-2">Operational Failure</p>
             <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-nature-100">
            <MapPin size={64} className="mx-auto mb-6 text-gray-100" />
            <h3 className="text-gray-800 font-black text-2xl uppercase tracking-widest">Expansion in Progress</h3>
            <p className="text-gray-400 font-medium mt-4">The Provincial Tourism Office is currently verifying new institutional destinations.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredSpots.length > 0 ? (
                  filteredSpots.map((spot) => (
                    <DestinationCard key={spot.id} item={spot} type="spot" />
                  ))
                ) : (
                  <div className="col-span-full py-40 text-center">
                     <p className="text-gray-300 font-black text-4xl uppercase tracking-[0.2em]">No Matches Found</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[4rem] overflow-hidden shadow-2xl shadow-nature-900/10 border border-white h-[700px] relative">
                <MapContainer 
                  markers={filteredSpots} 
                  height="100%" 
                  zoom={10} 
                  interactive={true} 
                />
              </div>
            )}
          </div>
        )}
        
        {/* Ecological Advisory */}
        <section className="bg-nature-950 p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-nature-400/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-colors group-hover:bg-nature-400/20"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-left">
                 <span className="text-nature-400 font-black uppercase tracking-widest text-[10px] mb-4 block">Travel Intelligence</span>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 italic leading-none">Respect the <span className="text-nature-400">Ancestral</span> Domain.</h2>
                 <p className="text-nature-100/60 text-lg leading-relaxed font-medium">All visits to remote spots require registration with local municipal units and accompaniment by DOT-accredited guides to ensure environmental preservation and traveler safety.</p>
              </div>
              <button className="px-10 py-6 bg-nature-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-nature-600/40 hover:bg-nature-500 transition-all">Download Guide (PDF)</button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Spots;

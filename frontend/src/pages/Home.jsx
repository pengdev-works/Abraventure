import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Users, Tent, ChevronRight, Globe, Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredSpots, setFeaturedSpots] = useState([]);
  const [impact, setImpact] = useState({ total_impact: 0, partner_count: 0, spot_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const [spotsRes, impactRes] = await Promise.all([
          axios.get(`${apiUrl}/spots`),
          axios.get(`${apiUrl}/verified-impact`)
        ]);
        setFeaturedSpots(spotsRes.data.slice(0, 3));
        setImpact(impactRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-earth-50 z-10"></div>
        <div className="absolute inset-0 bg-[url('/article-cover-photo-abra.webp')] bg-cover bg-center bg-no-repeat bg-fixed transform scale-105 transition-transform duration-[10s] ease-linear animate-slow-zoom"></div>
        
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto space-y-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white text-sm font-black uppercase tracking-[0.2em] mb-4 animate-fade-in-down">
            <span className="flex h-2 w-2 rounded-full bg-nature-400 animate-pulse"></span>
            <span>Institutional Governance & Community Tourism</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none animate-fade-in italic">
            Discover <span className="text-nature-400 drop-shadow-2xl not-italic">Abra</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-nature-50 mb-10 max-w-4xl mx-auto font-medium leading-relaxed drop-shadow-md animate-fade-in shadow-black/20 opacity-90">
            A high-fidelity destination ecosystem designed to empower ancestral heritage and sustainable growth across the province.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up">
            <Link to="/spots" className="bg-nature-600 hover:bg-nature-700 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest transition-all duration-300 shadow-2xl hover:shadow-nature-500/50 flex items-center justify-center group btn-hover">
              Explore Destinations <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-3xl text-white border border-white/30 px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest transition-all duration-300 flex items-center justify-center btn-hover">
              Learn the Mission
            </Link>
          </div>

          {/* Live Impact Counter Widget */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-200">
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center group hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest mb-1">Direct Economic Impact</p>
                <h4 className="text-3xl font-black text-white tracking-tighter">₱{Number(impact.total_impact || 0).toLocaleString()}</h4>
             </div>
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center group hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest mb-1">Verified Partners</p>
                <h4 className="text-3xl font-black text-white tracking-tighter">{impact.partner_count || 0}</h4>
             </div>
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center group hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest mb-1">Active Destinations</p>
                <h4 className="text-3xl font-black text-white tracking-tighter">{impact.spot_count || 0}</h4>
             </div>
          </div>
        </div>

        {/* Hero Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-earth-50 to-transparent z-10"></div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
            <div className="max-w-2xl">
              <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-3 block">Institutional Inventory</span>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight italic">
                Picturesque <span className="text-nature-600 drop-shadow-sm not-italic">Spotlights</span>
              </h2>
            </div>
            <Link to="/spots" className="flex items-center text-nature-700 font-black uppercase text-xs tracking-widest hover:text-nature-900 group transition-colors">
              Explore all spots <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-[500px] bg-white rounded-[3rem] animate-pulse shadow-sm"></div>
              ))
            ) : (
              featuredSpots.map((spot) => (
                <Link key={spot.id} to={`/spots/${spot.id}`} className="group relative h-[500px] overflow-hidden rounded-[3rem] shadow-2xl card-hover">
                  <img 
                    src={spot.image_url || '/placeholder-spot.jpg'} 
                    alt={spot.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 text-white translate-y-6 group-hover:translate-y-0 transition-transform duration-500 text-left">
                    <div className="flex items-center space-x-2 text-nature-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{spot.location}</span>
                    </div>
                    <h3 className="text-4xl font-black mb-4 tracking-tighter leading-none">{spot.name}</h3>
                    <p className="text-gray-300 line-clamp-2 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {spot.description}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Social Impact Pillar Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
             <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-4 block">Our Commitment</span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter italic">Designed for <span className="text-nature-600 not-italic">Accountability</span></h2>
            <p className="text-gray-500 text-xl font-medium leading-relaxed">
              We leverage data-driven governance to ensure tourism revenue directly supports municipal growth and sustainable livelihoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            <div className="space-y-8 group">
               <div className="w-20 h-20 bg-nature-950 text-nature-400 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"><Activity size={32} /></div>
               <h3 className="text-3xl font-black tracking-tight leading-none italic">Municipal <span className="text-nature-600 not-italic">Analytics</span></h3>
               <p className="text-gray-500 font-medium leading-relaxed">Transparent tracking of visitor trends and economic injection across every municipality in Abra.</p>
            </div>
            <div className="space-y-8 group">
               <div className="w-20 h-20 bg-earth-950 text-earth-400 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"><ShieldCheck size={32} /></div>
               <h3 className="text-3xl font-black tracking-tight leading-none italic">Verified <span className="text-nature-600 not-italic">Governance</span></h3>
               <p className="text-gray-500 font-medium leading-relaxed">System-wide audit logs and DOT-accredited partner verification to ensure institutional safety.</p>
            </div>
            <div className="space-y-8 group">
               <div className="w-20 h-20 bg-nature-950 text-nature-400 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"><Globe size={32} /></div>
               <h3 className="text-3xl font-black tracking-tight leading-none italic">Ecosystem <span className="text-nature-600 not-italic">Growth</span></h3>
               <p className="text-gray-500 font-medium leading-relaxed">Empowering local homestays and guides through integrated digital inquiry and management tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Protocols Section */}
      <section className="py-32 bg-nature-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div>
                <span className="text-nature-500 font-black uppercase tracking-widest text-xs mb-4 block">Travel Responsibly</span>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none italic">Community <span className="text-nature-500 not-italic">Protocols</span></h2>
                <p className="text-gray-400 text-xl leading-relaxed font-medium mb-12">
                  Joining the AbraVenture ecosystem means adhering to ancestral and institutional guidelines that protect our home.
                </p>
                <Link to="/register" className="inline-flex items-center text-white font-black uppercase text-xs tracking-[0.2em] border-b-2 border-nature-600 pb-2 hover:text-nature-400 transition-colors">
                   Join as a Verified Partner <ArrowRight className="ml-3 w-5 h-5" />
                </Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {protocols.map((p, i) => (
                   <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                      <span className="text-4xl font-black text-nature-600 mb-6 block opacity-50 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                      <h4 className="text-white font-black text-xl mb-3 tracking-tight">{p.title}</h4>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.desc}</p>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const protocols = [
  { title: "Pre-Registration", desc: "All tourists must secure an approved booking confirmation before arrival to ensure community capacity." },
  { title: "Net-Zero Impact", desc: "Strict adherence to Leave No Trace principles. Avoid single-use plastics and dispose of waste properly." },
  { title: "Cultural Honor", desc: "Respect ancestral traditions and ask permission before photographing community members or sacred sites." },
  { title: "Certified Guides", desc: "For safety and respect, all remote site visits require accompaniment by DOT-accredited local guides." }
];

export default Home;

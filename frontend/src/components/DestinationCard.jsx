import { MapPin, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ item, type, onActionClick }) => {
  const isHomestay = type === 'homestay';
  const isGuide = type === 'guide';
  const isSpot = type === 'spot';
  
  return (
    <div className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-[550px] overflow-hidden relative">
      {/* Visual Header */}
      <div className="relative h-[320px] w-full overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-earth-50 flex items-center justify-center text-earth-300">
             <MapPin size={48} className="opacity-20 translate-y-4" />
          </div>
        )}
        
        {/* Glassmorphic Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          {isHomestay && item.price_per_night && (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl text-white shadow-xl">
               <span className="text-[10px] font-black uppercase tracking-widest block opacity-70 leading-none mb-1">Price/Night</span>
               <span className="text-lg font-black tracking-tighter">₱{item.price_per_night}</span>
            </div>
          )}
          
          {isGuide && item.accreditation_level && (
            <div className="bg-nature-900/40 backdrop-blur-md border border-nature-400/30 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-2">
               <ShieldCheck size={16} className="text-nature-400" />
               <span className="text-xs font-black uppercase tracking-widest">{item.accreditation_level}</span>
            </div>
          )}
        </div>

        {/* Favorite/Rating Action */}
        <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-nature-600 transition-all shadow-xl group/fav">
           <Star size={20} className="group-hover/fav:fill-nature-600 transition-all" />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>
      
      {/* Content Body */}
      <div className="p-8 flex-grow flex flex-col text-left relative">
        {/* Floating Category/Location */}
        <div className="absolute -top-10 right-8 bg-nature-600 text-white px-5 py-2.5 rounded-2xl shadow-xl transform group-hover:-translate-y-2 transition-transform duration-500">
           <span className="text-[10px] font-black uppercase tracking-widest">{isSpot ? 'Destination' : type}</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-nature-600 text-[10px] font-black uppercase tracking-widest mb-2">
            <MapPin className="w-3 h-3" />
            {item.location || 'Discover Abra'}
          </div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-nature-700 transition-colors leading-tight">
            {item.name}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed flex-grow">
          {item.description || item.bio || "Experience the unblemished beauty and rich cultural heritage that this unique location offers to every traveler."}
        </p>
        
        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-6">
          {isSpot ? (
            <Link 
              to={`/spots/${item.id}`}
              className="flex items-center gap-2 text-nature-700 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            onActionClick && (
              <button 
                onClick={() => onActionClick(item)}
                className="flex items-center gap-2 text-nature-700 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
              >
                {isHomestay ? 'Secure Booking' : 'Contact Expert'} <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}
          
          <div className="flex items-center -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold overflow-hidden ring-1 ring-gray-100">
                 <img src={`https://i.pravatar.cc/100?u=${item.id}${i}`} className="w-full h-full object-cover" alt="visitor" />
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;

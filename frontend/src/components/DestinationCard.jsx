import { MapPin } from 'lucide-react';

const DestinationCard = ({ item, type, onActionClick }) => {
  // item can be a spot, guide, or homestay. We adapt based on type.
  const isHomestay = type === 'homestay';
  const isGuide = type === 'guide';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-nature-100 flex flex-col h-full transform hover:-translate-y-1 transition-transform">
      <div className="relative h-48 w-full bg-earth-200">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-earth-500 font-medium">
            Image Not Available
          </div>
        )}
        {isHomestay && item.price_per_night && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-nature-800 shadow-sm">
            ₱{item.price_per_night} / night
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
        
        {isHomestay && item.amenities && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.amenities.map((amenity, idx) => (
              <span key={idx} className="bg-nature-50 text-nature-700 text-xs px-2 py-1 rounded-md border border-nature-200">
                {amenity}
              </span>
            ))}
          </div>
        )}

        {isGuide && item.accreditation_level && (
          <div className="inline-block bg-earth-100 text-earth-800 text-xs px-2 py-1 rounded-md font-medium mb-3 self-start">
            {item.accreditation_level}
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {item.description || item.bio}
        </p>
        
        <div className="mt-auto">
          {onActionClick && (isHomestay || isGuide) && (
            <button 
              onClick={() => onActionClick(item)}
              className="w-full bg-nature-600 hover:bg-nature-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {isHomestay ? 'Book Now' : 'Contact Guide'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;

import React from 'react';

const HeroBanner = ({ title, subtitle, bgClass = 'from-nature-900 to-nature-700' }) => {
  return (
    <div className={`relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${bgClass}`}></div>
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://textures.world/wp-content/uploads/2018/10/3-Mountain-Texture-Background.jpg')] bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-nature-100 max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;

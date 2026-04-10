import React from 'react';

const HeroBanner = ({ title, subtitle, bgClass = 'from-nature-950 via-nature-900 to-nature-800' }) => {
  return (
    <div className={`relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden`}>
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} z-10`}></div>
      <div className="absolute inset-0 bg-[url('/article-cover-photo-abra.webp')] bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay z-0 scale-110 animate-slow-zoom"></div>
      
      {/* Decorative Overlays */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-20"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nature-400/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-earth-400/10 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

      {/* Content */}
      <div className="relative z-30 text-center px-6 max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-[0.3em] text-nature-300 animate-fade-in-down">
          Official Discovery Portal
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none animate-fade-in">
          {title.split(' ').map((word, i) => (
            <span key={i} className={i % 2 === 1 ? 'text-nature-400' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl text-nature-50/70 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in delay-200">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;

import React from 'react';
import HeroBanner from '../components/HeroBanner';
import { Leaf, Users, Shield, MapPin, Compass, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroBanner
        title="Institutional Mission"
        subtitle="Empowering communities through sustainable tourism. Preserving ancestral heritage in the heart of the Cordilleras."
        bgClass="from-nature-950 via-nature-900 to-nature-800"
      />

      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24 py-24 w-full space-y-32">
        {/* Narrative Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <div className="text-left space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <span className="text-nature-600 font-black uppercase text-[10px] tracking-[0.3em] block leading-none">Origins & Purpose</span>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none italic">Abra<span className="text-nature-600">Venture</span> Genesis.</h2>
            </div>
            <p className="text-xl text-gray-500 font-medium leading-[1.8]">
              Born from a vision to establish a robust, community-led platform, we connect travelers directly with the authentic, unblemished beauty of Abra. 
            </p>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              By emphasizing the accreditation of local experts and the verification of ancestral homestays, our system establishes a protocol that is both safe for institutional visitors and economically beneficial to the Abrenian people.
            </p>
            <div className="pt-6">
               <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-nature-50 border border-nature-100/50 inline-flex">
                  <ShieldCheck size={24} className="text-nature-600" />
                  <span className="text-nature-900 font-black uppercase text-[10px] tracking-widest">Governed by Municipal Protocol</span>
               </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl group">
            <img
              src="article-cover-photo-abra.webp"
              alt="Beautiful mountain view resembling Abra"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nature-950/40 to-transparent"></div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="text-center space-y-20">
          <div className="space-y-4">
            <span className="text-nature-600 font-black uppercase text-[10px] tracking-[0.3em] block leading-none">The Foundation</span>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic">Operational <span className="text-nature-600">Pillars</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { 
                label: 'Sustainability', 
                desc: 'Protecting natural landscapes through Net-Zero environmental protocols.', 
                icon: <Leaf className="text-nature-600" />,
                bg: 'bg-nature-50'
              },
              { 
                label: 'Community', 
                desc: 'Direct economic synchronization with local families and municipal units.', 
                icon: <Users className="text-earth-600" />,
                bg: 'bg-earth-50'
              },
              { 
                label: 'Governance', 
                desc: 'Multi-layer verification of all institutional guides and sanctuary hosts.', 
                icon: <Shield className="text-blue-600" />,
                bg: 'bg-blue-50'
              },
              { 
                label: 'Discovery', 
                desc: 'Facilitating secure access to the province\'s most remote ancestral sites.', 
                icon: <Compass className="text-orange-600" />,
                bg: 'bg-orange-50'
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 text-left">
                <div className={`w-16 h-16 ${pillar.bg} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(pillar.icon, { size: 32 })}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{pillar.label}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Stat Section */}
        <section className="bg-nature-950 p-12 md:p-24 rounded-[5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nature-400/10 rounded-full blur-[120px] -mr-64 -mt-64 transition-all"></div>
           <div className="relative z-10 text-center space-y-12">
              <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none">Preserving <span className="text-nature-400">Heritage</span>, {"\n"}Opening Doors.</h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                 {[
                   { val: '27+', label: 'Municipalities' },
                   { val: '100%', label: 'Local Sourced' },
                   { val: 'Zero', label: 'Commercial Filth' }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <p className="text-5xl md:text-7xl font-black text-nature-400 tracking-tighter leading-none">{stat.val}</p>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default About;

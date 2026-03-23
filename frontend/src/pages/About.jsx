import React from 'react';
import HeroBanner from '../components/HeroBanner';
import { Leaf, Users, Shield, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner
        title="About AbraVenture"
        subtitle="Empowering communities through sustainable tourism in the heart of the Cordilleras."
        bgClass="from-nature-900 to-earth-800"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Capstone Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              AbraVenture was born out of a desire to create a robust, community-driven platform that connects travelers with the authentic beauty of Abra. By emphasizing certified local guides and verified homestays, our system guarantees an experience that is both safe for tourists and economically beneficial to the local communities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This platform bridges the gap between raw, untouched nature and structured, sustainable tourism. Our goal is to preserve heritage while opening doors.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="article-cover-photo-abra.webp"
              alt="Beautiful mountain view resembling Abra"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Principles</h2>
          <div className="w-24 h-1 bg-nature-500 mx-auto rounded-full mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-nature-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-nature-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">Promoting eco-friendly practices that protect Abra's natural landscapes for future generations.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-earth-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-earth-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">Ensuring tourism directly benefits local families, homestay owners, and indigenous groups.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Authentication</h3>
              <p className="text-gray-600">Working with the local government to verify all guides and homestays for your safety.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exploration</h3>
              <p className="text-gray-600">Providing an easy-to-use directory for discovering hidden gems across the province.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;

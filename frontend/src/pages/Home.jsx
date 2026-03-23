import { ArrowRight, MapPin, Users, Tent } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-black/50 z-10 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-[url('/article-cover-photo-abra.webp')] bg-cover bg-center bg-no-repeat bg-fixed"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Discover <span className="text-earth-300">Abra</span>
          </h1>
          <p className="text-xl md:text-2xl text-nature-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the untouched beauty, rich heritage, and authentic community life of the North.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/spots" className="bg-earth-500 hover:bg-earth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-transform duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
              Explore Destinations <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/homestays" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center">
              Book a Homestay
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Community-Based Tourism</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We focus on local empowerment, ensuring your travels directly benefit the communities of Abra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Pillar 1 */}
            <div className="text-center p-6 rounded-2xl bg-nature-50 border border-nature-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-nature-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-white">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tourist Spots</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                From the majestic Kaparkan Falls to the serene Piis River, discover the hidden natural wonders of Abra, preserved by the locals.
              </p>
              <Link to="/spots" className="text-nature-600 font-semibold hover:text-nature-800 flex items-center justify-center">
                View Spots <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="text-center p-6 rounded-2xl bg-earth-50 border border-earth-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-white">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accredited Guides</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Explore with confidence. Our DOT-accredited local guides ensure a safe, informative, and culturally respectful journey.
              </p>
              <Link to="/guides" className="text-earth-600 font-semibold hover:text-earth-800 flex items-center justify-center">
                Meet Guides <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="text-center p-6 rounded-2xl bg-nature-50 border border-nature-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-nature-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-white">
                <Tent className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Homestays</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Experience warm Abreño hospitality. Stay in comfortable, certified homes and immerse yourself in daily local life.
              </p>
              <Link to="/homestays" className="text-nature-600 font-semibold hover:text-nature-800 flex items-center justify-center">
                Find Homestays <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Protocols Section */}
      <section className="py-24 bg-nature-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-earth-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-nature-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Tourist Protocols & Guidelines</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              To ensure a safe, respectful, and enriching experience for everyone, we kindly ask all visitors to adhere to the following protocols set by the local tourism office and community leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Protocol 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-earth-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-earth-500">
                <span className="text-earth-600 font-bold text-xl group-hover:text-white">01</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pre-Registration</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                All tourists must pre-register and secure a booking confirmation before arrival. Walk-ins may not always be accommodated depending on community capacity.
              </p>
            </div>

            {/* Protocol 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-nature-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-nature-600">
                <span className="text-nature-600 font-bold text-xl group-hover:text-white">02</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Environmental Respect</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Strict adherence to the "Leave No Trace" principle. Proper waste disposal is mandatory. Avoid bringing single-use plastics to our pristine destinations.
              </p>
            </div>

            {/* Protocol 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-earth-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-earth-500">
                <span className="text-earth-600 font-bold text-xl group-hover:text-white">03</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Sensitivity</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Respect local customs, traditions, and sacred sites. Always ask for permission before taking photographs of the indigenous community members.
              </p>
            </div>

            {/* Protocol 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-nature-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-nature-600">
                <span className="text-nature-600 font-bold text-xl group-hover:text-white">04</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accredited Guides</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                For your safety, tourists are required to be accompanied by a recognized DOT-accredited local guide, especially in remote tourism spots.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

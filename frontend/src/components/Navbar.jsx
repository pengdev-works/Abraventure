import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Menu, X, Tent, Users, Home } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5 mr-1" /> },
    { name: 'Tourist Spots', path: '/spots', icon: <Map className="w-5 h-5 mr-1" /> },
    { name: 'Guides', path: '/guides', icon: <Users className="w-5 h-5 mr-1" /> },
    { name: 'Homestays', path: '/homestays', icon: <Tent className="w-5 h-5 mr-1" /> },
  ];

  return (
    <nav className="bg-nature-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <span className="font-bold text-2xl tracking-tight text-nature-50">Abra<span className="text-earth-300">Venture</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path 
                    ? 'bg-nature-900 text-earth-100' 
                    : 'text-nature-100 hover:bg-nature-700 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-nature-200 hover:text-white hover:bg-nature-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-nature-900 absolute w-full left-0 border-t border-nature-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-4 rounded-md text-base font-medium ${
                  location.pathname === link.path 
                    ? 'bg-nature-800 text-earth-100' 
                    : 'text-nature-200 hover:bg-nature-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Menu, X, Tent, Users, Home, Info, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Tourist Spots', path: '/spots', icon: <Map className="w-4 h-4 mr-2" /> },
    { name: 'Guides', path: '/guides', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Homestays', path: '/homestays', icon: <Tent className="w-4 h-4 mr-2" /> },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    scrolled 
      ? 'bg-white/80 backdrop-blur-lg shadow-lg py-4' 
      : isHomePage ? 'bg-transparent py-6' : 'bg-nature-900 shadow-lg py-4'
  }`;

  const linkClasses = (path) => `
    flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
    ${scrolled || !isHomePage
      ? location.pathname === path 
        ? 'bg-nature-600 text-white shadow-md' 
        : 'text-gray-700 hover:bg-nature-50 hover:text-nature-700'
      : location.pathname === path
        ? 'bg-white/20 text-white backdrop-blur-md'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }
  `;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center group">
              <span className={`font-black text-2xl tracking-tighter transition-colors duration-300 ${
                scrolled || !isHomePage ? 'text-gray-900' : 'text-white'
              }`}>
                Abra<span className="text-nature-600 group-hover:text-nature-500 transition-colors">Venture</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {links.map((link) => (
              <Link key={link.name} to={link.path} className={linkClasses(link.path)}>
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className={`h-6 w-px mx-4 ${scrolled || !isHomePage ? 'bg-gray-200' : 'bg-white/20'}`}></div>
            
            <Link 
              to="/login" 
              className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 btn-hover ${
                scrolled || !isHomePage
                ? 'bg-nature-600 text-white shadow-lg shadow-nature-600/20 hover:bg-nature-700'
                : 'bg-white text-nature-900 shadow-xl'
              }`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Partner Access
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-colors ${
                scrolled || !isHomePage ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full left-0 transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white shadow-2xl rounded-b-[2rem] border-t border-gray-100">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-4 rounded-2xl text-base font-bold transition-colors ${
                location.pathname === link.path 
                  ? 'bg-nature-50 text-nature-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <Link 
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-full mt-4 px-4 py-4 rounded-2xl bg-nature-600 text-white text-base font-bold shadow-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Partner Access
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

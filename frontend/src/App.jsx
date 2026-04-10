import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homestays from './pages/Homestays';
import Home from './pages/Home';
import Spots from './pages/Spots';
import SpotDetails from './pages/SpotDetails';
import Guides from './pages/Guides';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homestays" element={<Homestays />} />
          <Route path="/spots" element={<Spots />} />
          <Route path="/spots/:id" element={<SpotDetails />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/about" element={<About />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          </Route>
        </Routes>
      </main>
      
      <footer className="bg-nature-900 text-nature-100 py-12 text-center mt-auto border-t border-nature-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">AbraVenture</h2>
            <p className="text-nature-400 text-sm max-w-xs">Connecting the world to the hidden gems of the North.</p>
          </div>
          <div className="flex justify-center space-x-6 text-xs font-bold uppercase tracking-widest text-nature-500">
            <Link to="/login" className="hover:text-white transition-colors">Partner Access</Link>
            <Link to="/register" className="hover:text-white transition-colors">Become a Partner</Link>
          </div>
          <p className="text-nature-600 text-[10px]">&copy; {new Date().getFullYear()} AbraVenture. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homestays from './pages/Homestays';
import Home from './pages/Home';
import Spots from './pages/Spots';
import SpotDetails from './pages/SpotDetails';
import Guides from './pages/Guides';
import About from './pages/About';
import Login from './pages/Login';
import RegisterAdmin from './pages/RegisterAdmin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homestays" element={<Homestays />} />
          <Route path="/spots" element={<Spots />} />
          <Route path="/spots/:id" element={<SpotDetails />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/about" element={<About />} />
          
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin-register" element={<RegisterAdmin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      
      <footer className="bg-nature-900 text-nature-100 py-8 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p>&copy; {new Date().getFullYear()} AbraVenture. Empowering Local Tourism.</p>
          <div className="flex justify-center space-x-4 text-sm text-nature-400">
            <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <span>•</span>
            <Link to="/admin-register" className="hover:text-white transition-colors">Register Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

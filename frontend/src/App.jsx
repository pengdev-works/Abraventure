import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homestays from './pages/Homestays';
import Home from './pages/Home';
import Spots from './pages/Spots';
import Guides from './pages/Guides';
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
          <Route path="/guides" element={<Guides />} />
          
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin-register" element={<RegisterAdmin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      
      <footer className="bg-nature-900 text-nature-100 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} AbraVenture. Empowering Local Tourism.</p>
      </footer>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: 'Authenticating...',
      html: 'Validating credentials and establishing secure session.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/auth/login`, { username, password });
      
      Swal.close();

      const { token, role, status, username: loggedUsername } = response.data;

      if (status === 'pending') {
        Swal.fire({
          icon: 'info',
          title: 'Account Verification Pending',
          text: 'Your partner account is currently being reviewed by our administrative team. We appreciate your patience!',
          confirmButtonColor: '#43805f',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl px-8 py-3'
          }
        });
        setLoading(false);
        return;
      }

      if (status === 'rejected') {
        Swal.fire({
          icon: 'error',
          title: 'Access Restricted',
          text: 'Your registration request has not been approved at this time. Please reach out to our support team for clarification.',
          confirmButtonColor: '#b91c1c',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl px-8 py-3'
          }
        });
        setLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', loggedUsername);
      localStorage.setItem('role', role);

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `Successfully authenticated as ${loggedUsername}.`,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-[2rem]'
        }
      });

      // Redirect based on role
      setTimeout(() => {
        if (role === 'admin') navigate('/admin-dashboard');
        else navigate('/owner-dashboard');
      }, 1500);

    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.error || 'Unable to connect to server. Please try again.',
        confirmButtonColor: '#b91c1c',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3'
        }
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Immersive Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-nature-900/40 z-10 transition-opacity duration-700"></div>
        <img 
          src="/article-cover-photo-abra.webp" 
          alt="Abra Landscape" 
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        <div className="relative z-20 flex flex-col justify-between p-16 w-full text-white">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-black text-3xl tracking-tighter text-white">Abra<span className="text-nature-400 group-hover:text-nature-300 transition-colors">Venture</span></span>
          </Link>
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-widest text-nature-300">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Partner Portal
            </div>
            <h2 className="text-6xl font-black tracking-tight leading-none text-white">
              Managing the <br/><span className="text-nature-400">Future of Tourism</span>
            </h2>
            <p className="text-xl text-white/70 max-w-lg font-medium leading-relaxed">
              Empowering local guides and homestay owners to showcase the true essence of Abra to the world.
            </p>
          </div>

          <div className="flex items-center space-x-6">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-2 border-nature-900 bg-nature-800 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                   {String.fromCharCode(64 + i)}
                 </div>
               ))}
             </div>
             <span className="text-sm font-bold text-white/60 tracking-wide">Joined by 500+ local partners</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Background blobs for aesthetic */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nature-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-earth-50 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="w-full max-w-md space-y-12">
          <div className="text-left space-y-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Please enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 group text-left">
                <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-nature-600">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-600 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-500 outline-none transition-all duration-300 font-medium"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-2 group text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-nature-600">Password</label>
                  <a href="#" className="text-xs font-bold text-nature-600 hover:text-nature-700 transition-colors">Forgot Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-500 outline-none transition-all duration-300 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-8 py-5 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-nature-600 hover:bg-nature-700 focus:outline-none focus:ring-4 focus:ring-nature-500/50 transition-all duration-300 disabled:opacity-50 btn-hover"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-gray-500 font-medium">
            Don't have a partner account?{' '}
            <Link to="/register" className="text-nature-600 font-black hover:text-nature-700 transition-colors underline decoration-2 underline-offset-4 decoration-nature-200">
              Apply Now
            </Link>
          </p>

          <div className="pt-8 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 tracking-widest uppercase">
            <span>© 2026 AbraVenture</span>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

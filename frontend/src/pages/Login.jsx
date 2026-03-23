import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Show a loading alert because Render backend might take 50s to wake up on first load
    Swal.fire({
      title: 'Connecting to Server...',
      html: 'Please wait. If this is the first login today, the free server may take up to <b>50 seconds</b> to wake up.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/auth/login`, { username, password });
      
      Swal.close(); // Close the loading alert

      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('adminUsername', response.data.username);
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      Swal.close();
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-earth-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-nature-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-nature-100 text-nature-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">PTO Admin Login</h2>
          <p className="text-gray-500 mt-2">Provincial Tourism Office Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nature-700 hover:bg-nature-800 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-70 flex justify-center items-center shadow-lg"
          >
            {loading ? (
              <span className="inline-block animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : 'Login to Dashboard'}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            Are you an authorized personnel?{' '}
            <button
              type="button"
              onClick={() => navigate('/admin-register')}
              className="text-nature-600 hover:text-nature-800 font-semibold hover:underline"
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

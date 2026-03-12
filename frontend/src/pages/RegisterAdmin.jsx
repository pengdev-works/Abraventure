import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const RegisterAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/auth/register`, { username, password });
      
      setSuccess('Admin account created successfully! You can now log in.');
      
      // Clear form
      setUsername('');
      setPassword('');
      
      // Optionally redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Username might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-earth-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-nature-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-earth-100 text-earth-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Setup Admin</h2>
          <p className="text-gray-500 mt-2">Create a new Provincial Tourism Office account</p>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-100 mb-6 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desired Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
              placeholder="e.g. pto_admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secure Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success !== ''}
            className="w-full bg-earth-600 hover:bg-earth-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-70 flex justify-center items-center shadow-lg"
          >
            {loading ? (
              <span className="inline-block animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-nature-600 hover:text-nature-800 text-sm font-medium transition-colors">
            Already have an account? Go to Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;

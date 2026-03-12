import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Map, Users, Tent, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('spots'); // spots, guides, homestays
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem('adminUsername') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUsername');
    navigate('/login');
  };

  // State for forms
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({});
    setStatus({ loading: false, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      await axios.post(`${apiUrl}/${activeTab}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ loading: false, success: `Successfully added new ${activeTab.slice(0,-1)}!`, error: '' });
      setFormData({});
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        success: '', 
        error: err.response?.data?.error || 'An error occurred while saving.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-nature-900 text-white flex flex-col min-h-full shadow-xl">
        <div className="p-6 border-b border-nature-800">
          <h2 className="text-2xl font-bold tracking-tight text-nature-50">PTO Portal</h2>
          <p className="text-sm text-nature-300 mt-1">Welcome, {adminUsername}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => handleTabChange('spots')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'spots' ? 'bg-nature-800 text-white' : 'text-nature-300 hover:bg-nature-800 hover:text-white'}`}
          >
            <Map className="w-5 h-5" /> Tourist Spots
          </button>
          
          <button 
            onClick={() => handleTabChange('guides')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'guides' ? 'bg-nature-800 text-white' : 'text-nature-300 hover:bg-nature-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" /> Accredited Guides
          </button>
          
          <button 
            onClick={() => handleTabChange('homestays')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'homestays' ? 'bg-nature-800 text-white' : 'text-nature-300 hover:bg-nature-800 hover:text-white'}`}
          >
            <Tent className="w-5 h-5" /> Certified Homestays
          </button>
        </nav>

        <div className="p-4 border-t border-nature-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 capitalize">
              <Plus className="w-8 h-8 text-nature-600" />
              Add New {activeTab.slice(0,-1)}
            </h1>

            {status.success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium">
                {status.success}
              </div>
            )}
            
            {status.error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input type="text" name="image_url" value={formData.image_url || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500 placeholder-gray-400" placeholder="https://example.com/image.jpg" />
              </div>

              {/* Spots Specific */}
              {activeTab === 'spots' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input required type="text" name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required name="description" rows="4" value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500"></textarea>
                  </div>
                </>
              )}

              {/* Guides Specific */}
              {activeTab === 'guides' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation Level</label>
                    <select required name="accreditation_level" value={formData.accreditation_level || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500">
                      <option value="">Select Level</option>
                      <option value="DOT Accredited">DOT Accredited</option>
                      <option value="Local Expert">Local Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input required type="text" name="contact_number" value={formData.contact_number || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea required name="bio" rows="4" value={formData.bio || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500"></textarea>
                  </div>
                </>
              )}

              {/* Homestays Specific */}
              {activeTab === 'homestays' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (₱)</label>
                    <input required type="number" step="0.01" name="price_per_night" value={formData.price_per_night || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma separated)</label>
                    <input required type="text" name="amenities" value={formData.amenities || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" placeholder="e.g. WiFi, Aircon, Breakfast included" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required name="description" rows="4" value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500"></textarea>
                  </div>
                </>
              )}

              <button disabled={status.loading} type="submit" className="w-full bg-nature-600 hover:bg-nature-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-6 flex justify-center items-center">
                {status.loading ? (
                  <span className="inline-block animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                ) : `Save ${activeTab.slice(0,-1)}`}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

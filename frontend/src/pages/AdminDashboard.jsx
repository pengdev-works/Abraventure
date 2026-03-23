import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Map, Users, Tent, Plus, MessageSquare, LayoutDashboard, Download } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, spots, guides, homestays, inquiries
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
  const [stats, setStats] = useState({ spots: 0, guides: 0, homestays: 0, inquiries: 0 });
  const [items, setItems] = useState({ spots: [], guides: [], homestays: [], inquiries: [] });
  const [editingId, setEditingId] = useState(null);
  const [inquiryFilter, setInquiryFilter] = useState('all'); // all, pending, confirmed, declined

  const handleDownloadCSV = () => {
    if (items.inquiries.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['ID', 'Guest Name', 'Contact Details', 'Target Type', 'Target Name', 'Booking Date', 'Status', 'GCash Ref'];
    
    const csvRows = items.inquiries.map(inquiry => {
      return [
        inquiry.id,
        `"${inquiry.guest_name.replace(/"/g, '""')}"`,
        `"${inquiry.contact_details.replace(/"/g, '""')}"`,
        inquiry.type,
        `"${(inquiry.target_name || inquiry.target_id).toString().replace(/"/g, '""')}"`,
        new Date(inquiry.booking_date).toLocaleDateString(),
        inquiry.status,
        inquiry.payment_reference || 'N/A'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AbraVenture_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const results = await Promise.allSettled([
        axios.get(`${apiUrl}/spots`),
        axios.get(`${apiUrl}/guides`),
        axios.get(`${apiUrl}/homestays`),
        axios.get(`${apiUrl}/inquiries`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const spotsData = results[0].status === 'fulfilled' ? results[0].value.data : [];
      const guidesData = results[1].status === 'fulfilled' ? results[1].value.data : [];
      const homestaysData = results[2].status === 'fulfilled' ? results[2].value.data : [];
      const inquiriesData = results[3].status === 'fulfilled' ? results[3].value.data : [];

      setItems({
        spots: spotsData,
        guides: guidesData,
        homestays: homestaysData,
        inquiries: inquiriesData
      });
      
      setStats({
        spots: spotsData.length,
        guides: guidesData.length,
        homestays: homestaysData.length,
        inquiries: inquiriesData.filter(i => i.status === 'pending').length
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g. max 5MB) to avoid payload too large
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ loading: false, success: '', error: 'Image size should be less than 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({});
    setEditingId(null);
    setStatus({ loading: false, success: '', error: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const data = { ...item };
    if (activeTab === 'homestays' && Array.isArray(data.amenities)) {
      data.amenities = data.amenities.join(', ');
    }
    setFormData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiUrl}/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStats();
      if (editingId === id) {
        setFormData({});
        setEditingId(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete item.');
    }
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${apiUrl}/inquiries/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStats();
    } catch (err) {
      console.error('Update status failed:', err);
      alert('Failed to update inquiry status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (editingId) {
        await axios.put(`${apiUrl}/${activeTab}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus({ loading: false, success: `Successfully updated ${activeTab.slice(0,-1)}!`, error: '' });
      } else {
        await axios.post(`${apiUrl}/${activeTab}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus({ loading: false, success: `Successfully added new ${activeTab.slice(0,-1)}!`, error: '' });
      }

      setFormData({});
      setEditingId(null);
      
      // Refresh stats after adding/updating
      fetchStats();
      
      // Reset file input by clearing the form
      const fileInput = document.getElementById('image_upload');
      if (fileInput) fileInput.value = '';
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
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-nature-800 text-white' : 'text-nature-300 hover:bg-nature-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard Overview
          </button>
          
          <div className="pt-4 pb-2 border-t border-nature-800/50 mt-4 mb-2">
            <p className="px-4 text-xs font-semibold text-nature-400 uppercase tracking-wider">Management</p>
          </div>

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
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === 'homestays' ? 'bg-nature-800 text-white' : 'text-nature-300 hover:bg-nature-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><Tent className="w-5 h-5" /> Certified Homestays</div>
          </button>
          
          <button 
            onClick={() => handleTabChange('inquiries')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === 'inquiries' ? 'bg-nature-800 text-white' : 'text-nature-300 hover:bg-nature-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5" /> Booking Inquiries</div>
            {stats.inquiries > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.inquiries}</span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-nature-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-nature-600" /> Platform Overview
              </h1>
              
              {/* Statistics Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Total Spots</p>
                    <div className="w-10 h-10 bg-nature-100 rounded-full flex items-center justify-center text-nature-600">
                      <Map className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.spots}</h3>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Total Guides</p>
                    <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center text-earth-600">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.guides}</h3>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Homestays</p>
                    <div className="w-10 h-10 bg-nature-100 rounded-full flex items-center justify-center text-nature-600">
                      <Tent className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.homestays}</h3>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Pending Inquiries</p>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-orange-600">{stats.inquiries}</h3>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Distribution</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Spots', value: stats.spots, fill: '#16a34a' },
                            { name: 'Guides', value: stats.guides, fill: '#d97706' },
                            { name: 'Homestays', value: stats.homestays, fill: '#059669' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell key={`cell-0`} fill="#16a34a" />
                          <Cell key={`cell-1`} fill="#d97706" />
                          <Cell key={`cell-2`} fill="#059669" />
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Economics (₱)</h3>
                  <p className="text-xs text-gray-500 mb-4">*Potential Revenue is calculated from pending homestay requests (Avg 2 nights).</p>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: 'Revenue Pipeline',
                            Potential: (() => {
                              let total = 0;
                              items.inquiries.forEach(i => {
                                if (i.type === 'homestay') {
                                  const h = items.homestays.find(h => h.id === i.target_id);
                                  if (h && h.price_per_night) total += parseFloat(h.price_per_night) * 2;
                                }
                              });
                              return total;
                            })(),
                            Confirmed: (() => {
                              let total = 0;
                              items.inquiries.forEach(i => {
                                if (i.type === 'homestay' && i.status === 'confirmed') {
                                  const h = items.homestays.find(h => h.id === i.target_id);
                                  if (h && h.price_per_night) total += parseFloat(h.price_per_night) * 2;
                                }
                              });
                              return total;
                            })()
                          }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip formatter={(value) => `₱${value}`} />
                        <Legend />
                        <Bar dataKey="Potential" fill="#eab308" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Confirmed" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Activity Feed
                </h3>
                {items.inquiries.length > 0 ? (
                  <div className="space-y-6">
                    {items.inquiries.slice(0, 5).map((inquiry, idx) => (
                      <div key={idx} className="flex gap-4 items-start relative pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            inquiry.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                            inquiry.status === 'declined' ? 'bg-red-100 text-red-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 font-medium whitespace-pre-line">
                            <span className="font-bold">{inquiry.guest_name}</span> {
                              inquiry.status === 'pending' ? 'submitted a new booking request' :
                              inquiry.status === 'confirmed' ? 'had their booking confirmed' :
                              'had their booking declined'
                            } for {inquiry.type} <span className="font-bold">{inquiry.target_name}</span>.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(inquiry.created_at || inquiry.booking_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No recent activity detected.</p>
                )}
              </div>
            </div>
          )}

          {/* Add/Edit Form - Hide on Inquiries & Overview Tabs */}
          {activeTab !== 'inquiries' && activeTab !== 'overview' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 capitalize">
                <Plus className="w-8 h-8 text-nature-600" />
                {editingId ? `Edit ${activeTab.slice(0,-1)}` : `Add New ${activeTab.slice(0,-1)}`}
              </h1>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setFormData({}); }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                <input 
                  type="file" 
                  id="image_upload"
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nature-50 file:text-nature-700 hover:file:bg-nature-100" 
                />
                {formData.image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <img src={formData.image_url} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input type="number" step="any" name="latitude" value={formData.latitude || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" placeholder="17.5995" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input type="number" step="any" name="longitude" value={formData.longitude || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" placeholder="120.6200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">How to Get There (Directions)</label>
                    <textarea required name="directions" rows="3" value={formData.directions || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" placeholder="e.g. From Bangued, take a jeep to..."></textarea>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (Municipality)</label>
                    <input required type="text" name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" placeholder="e.g. Tineg" />
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (Municipality)</label>
                    <input required type="text" name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nature-500 focus:border-nature-500" placeholder="e.g. Tineg" />
                  </div>
                </>
              )}

              <button disabled={status.loading} type="submit" className="w-full bg-nature-600 hover:bg-nature-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-6 flex justify-center items-center">
                {status.loading ? (
                  <span className="inline-block animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                ) : (editingId ? `Update ${activeTab.slice(0,-1)}` : `Save ${activeTab.slice(0,-1)}`)}
              </button>
            </form>
          </div>
          )}

          {/* List of Items */}
          {activeTab !== 'overview' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'inquiries' ? 'Booking Requests & Inquiries' : `Manage ${activeTab}`}
              </h2>
              
              {activeTab === 'inquiries' && (
                <button 
                  onClick={handleDownloadCSV}
                  className="bg-nature-50 border border-nature-200 text-nature-700 hover:bg-nature-100 hover:text-nature-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Report (CSV)
                </button>
              )}
            </div>

            {activeTab === 'inquiries' && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'confirmed', 'declined'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setInquiryFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                      inquiryFilter === filter 
                        ? 'bg-nature-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'All Inquiries' : filter}
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              {activeTab === 'inquiries' ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm md:text-base">
                      <th className="pb-3 font-semibold text-gray-600">Guest</th>
                      <th className="pb-3 font-semibold text-gray-600">Target</th>
                      <th className="pb-3 font-semibold text-gray-600">Request Date</th>
                      <th className="pb-3 font-semibold text-gray-600">Status</th>
                      <th className="pb-3 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.inquiries
                      .filter(i => inquiryFilter === 'all' || i.status === inquiryFilter)
                      .map(item => (
                      <tr key={item.id} className={`transition-colors ${item.status === 'pending' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                        <td className="py-4">
                          <p className="font-bold text-gray-900">{item.guest_name}</p>
                          <p className="text-sm text-gray-600 mb-1">{item.contact_details}</p>
                          {item.payment_reference && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-blue-100 text-blue-800 border border-blue-200">
                              GCash Ref: {item.payment_reference}
                            </span>
                          )}
                          {item.message && <p className="text-xs text-gray-500 italic mt-1 max-w-xs truncate">"{item.message}"</p>}
                        </td>
                        <td className="py-4 text-gray-600">
                          <span className={`text-xs px-2 py-1 rounded inline-block mb-1 ${item.type === 'homestay' ? 'bg-nature-100 text-nature-800' : 'bg-earth-100 text-earth-800'}`}>
                            {item.type}
                          </span>
                          <p className="font-medium text-gray-900">{item.target_name || `ID #${item.target_id}`}</p>
                        </td>
                        <td className="py-4 font-medium text-gray-900">
                          {new Date(item.booking_date).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            item.status === 'declined' ? 'bg-red-100 text-red-700' :
                            'bg-orange-200 text-orange-800'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-right whitespace-nowrap">
                          {item.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleUpdateInquiryStatus(item.id, 'confirmed')} className="text-xs bg-nature-600 hover:bg-nature-700 text-white px-3 py-1.5 rounded transition-colors font-medium">Confirm</button>
                              <button onClick={() => handleUpdateInquiryStatus(item.id, 'declined')} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded transition-colors font-medium">Decline</button>
                            </div>
                          ) : (
                            <button onClick={() => handleUpdateInquiryStatus(item.id, 'pending')} className="text-xs text-gray-500 hover:text-gray-800 underline">Reopen</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {items.inquiries.filter(i => inquiryFilter === 'all' || i.status === inquiryFilter).length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">No inquiries found matching this filter.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-sm md:text-base">
                    <th className="pb-3 font-semibold text-gray-600">Name</th>
                    {activeTab === 'spots' && <th className="pb-3 font-semibold text-gray-600">Location</th>}
                    {activeTab === 'guides' && <th className="pb-3 font-semibold text-gray-600">Level</th>}
                    {activeTab === 'homestays' && <th className="pb-3 font-semibold text-gray-600">Price (₱)</th>}
                    <th className="pb-3 font-semibold text-gray-600">Location</th>
                    <th className="pb-3 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items[activeTab].map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">{item.name}</td>
                      {activeTab === 'spots' && <td className="py-4 text-gray-600">{item.location}</td>}
                      {activeTab === 'guides' && <td className="py-4 text-gray-600">{item.accreditation_level}</td>}
                      {activeTab === 'homestays' && <td className="py-4 text-gray-600">₱{item.price_per_night}</td>}
                      <td className="py-4 text-gray-600 text-sm font-medium">{item.location || 'N/A'}</td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <button onClick={() => handleEdit(item)} className="text-nature-600 hover:text-nature-900 font-medium mr-4 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {items[activeTab].length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No {activeTab} found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              )}
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, User, Tent, MessageSquare, LayoutDashboard, 
  Save, Clock, CheckCircle, XCircle, ChevronLeft, 
  Bell, Settings, Eye, Edit3, Calendar, MapPin, 
  CreditCard, Briefcase, Camera, Menu, TrendingUp, DollarSign, Star
} from 'lucide-react';
import Swal from 'sweetalert2';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const [profileRes, inquiriesRes] = await Promise.all([
        axios.get(`${apiUrl}/profile/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/my-inquiries`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setProfile(profileRes.data);
      setInquiries(inquiriesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const endpoint = role === 'guide' ? `/guides/${profile.id}` : `/homestays/${profile.id}`;
      
      await axios.put(`${apiUrl}${endpoint}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your partner listing has been synchronized successfully.',
        confirmButtonColor: '#43805f',
        customClass: { popup: 'rounded-[1.5rem]' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to save profile changes.',
        confirmButtonColor: '#b91c1c',
        customClass: { popup: 'rounded-[1.5rem]' }
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      await axios.put(`${apiUrl}/inquiries/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchDashboardData();
      
      Swal.fire({
        icon: 'success',
        title: `Request ${status === 'confirmed' ? 'Accepted' : 'Declined'}`,
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-[1.5rem]' }
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to update request status.', 'error');
    }
  };

  const finalizeInquiry = async (id) => {
    const { value: amount } = await Swal.fire({
      title: 'Complete Experience',
      input: 'number',
      inputLabel: 'Total Revenue Realized (PHP)',
      inputPlaceholder: '2500.00',
      showCancelButton: true,
      confirmButtonText: 'Finalize & Close',
      customClass: { popup: 'rounded-[3rem]' }
    });

    if (amount) {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.put(`${apiUrl}/inquiries/${id}/status`, { status: 'completed', amount }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDashboardData();
        Swal.fire({ icon: 'success', title: 'Mission Accomplished', text: 'Revenue has been logged in your impact history.', timer: 2000, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', 'Failed to finalize session.', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Image size should be less than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const totalRevenue = inquiries
    .filter(i => i.status === 'completed')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const menuItems = [
    { id: 'overview', label: 'Ecosystem', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: role === 'guide' ? 'Intelligence Portfolio' : 'Listing Node', icon: role === 'guide' ? <Briefcase size={20} /> : <Tent size={20} /> },
    { id: 'inquiries', label: 'Engagements', icon: <MessageSquare size={20} />, count: inquiries.filter(i => i.status === 'pending').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-earth-50 space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-nature-600/20 border-t-nature-600 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-earth-600/20 border-b-earth-600 animate-spin-reverse"></div>
        </div>
        <p className="text-earth-800 font-black tracking-widest uppercase text-xs animate-pulse">Establishing Root Link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-500 ease-in-out
        ${sidebarCollapsed ? 'w-20' : 'w-72'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-nature-600 shadow-sm z-50 transition-transform hidden md:flex"><ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`} /></button>
        <div className="p-8 pb-4 flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-nature-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-nature-600/20"><TrendingUp size={24} /></div>
          <span className={`font-black text-xl tracking-tighter text-gray-900 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Business<span className="text-nature-600">Core</span></span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative ${activeTab === item.id ? 'bg-nature-50 text-nature-700' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}><div className={`transition-all duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</div><span className={`font-bold transition-opacity duration-300 whitespace-nowrap ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>{item.label}</span>{item.count > 0 && <span className={`absolute right-4 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${sidebarCollapsed ? 'top-2 right-2' : ''}`}>{item.count}</span>}</button>
          ))}
        </nav>
        <div className="p-6 mt-auto">
          <div className={`p-4 rounded-2xl bg-earth-50 border border-earth-100 mb-6 transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 scale-90' : 'opacity-100'}`}><p className="text-[10px] font-black text-earth-300 uppercase tracking-widest mb-1">Impact Agent</p><p className="text-sm font-bold text-earth-900 truncate">{username}</p></div>
          <button onClick={handleLogout} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 font-bold transition-all hover:bg-red-50 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}><LogOut size={20} /><span className={`whitespace-nowrap ${sidebarCollapsed ? 'hidden' : 'block'}`}>Sign Out</span></button>
        </div>
      </aside>

      {/* Main UI */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setMobileMenuOpen(true)} className="w-10 h-10 rounded-xl bg-nature-50 border border-nature-100 flex items-center justify-center text-nature-600 md:hidden"><Menu className="w-6 h-6" /></button>
             <div className="hidden md:block text-left">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none block">Operations Control</span>
                <h2 className="text-xl font-bold text-gray-900 capitalize tracking-tight">{activeTab}</h2>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex flex-col text-right">
                <p className="text-[10px] font-black text-nature-600 uppercase tracking-widest">Revenue Impact</p>
                <p className="text-xl font-black text-gray-900 italic tracking-tighter">₱{totalRevenue.toLocaleString()}</p>
             </div>
             <div className="h-8 w-px bg-gray-100"></div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nature-400 to-nature-600 flex items-center justify-center text-white font-black shadow-lg shadow-nature-600/20 uppercase">{username?.charAt(0)}</div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FDFCFB] custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10 pb-20">
            
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-fade-in text-left">
                <section>
                   <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 italic">Control <span className="text-nature-600">Console</span></h1>
                   <p className="text-lg md:text-xl text-gray-500 font-medium tracking-tight">Financial yield and ecosystem engagement overview.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="bg-nature-950 p-8 rounded-[2.5rem] shadow-xl group hover:shadow-nature-600/20 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-nature-400/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-nature-800 text-nature-400 rounded-2xl flex items-center justify-center mb-6"><DollarSign size={24} /></div>
                      <p className="text-xs font-black text-nature-400 uppercase tracking-widest mb-1 italic">Realized Revenue</p>
                      <h3 className="text-4xl font-black text-white tracking-tighter">₱{totalRevenue.toLocaleString()}</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-nature-50 text-nature-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><MessageSquare size={24} /></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Queue Size</p>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">{inquiries.filter(i => i.status === 'pending').length}</h3>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><CheckCircle size={24} /></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Success Ratio</p>
                    <h3 className="text-4xl md:text-5xl font-black text-green-600 tracking-tighter">{inquiries.length > 0 ? ((inquiries.filter(i => i.status === 'completed').length / inquiries.length) * 100).toFixed(0) : 0}%</h3>
                  </div>
                </div>

                <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                   <div className="px-8 py-8 border-b border-gray-50 flex justify-between items-center"><h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Engagement Log</h3><button onClick={() => setActiveTab('inquiries')} className="bg-nature-50 text-nature-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-nature-100 transition-colors">Audit Inquiries</button></div>
                   <div className="divide-y divide-gray-50 text-left">
                      {inquiries.slice(0, 5).map((inquiry, idx) => (
                        <div key={idx} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${inquiry.status === 'completed' ? 'bg-nature-900 text-nature-400' : 'bg-gray-50 text-gray-400'}`}><User size={24} /></div>
                              <div><p className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">{inquiry.guest_name}</p><div className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-400"><span>{inquiry.status}</span><span>•</span><span>{new Date(inquiry.created_at).toLocaleDateString()}</span></div></div>
                           </div>
                           <div className="text-right">
                              {inquiry.status === 'completed' ? <p className="text-lg font-black text-nature-700 tracking-tighter">₱{Number(inquiry.amount).toLocaleString()}</p> : <span className="text-xs font-bold text-gray-300">Awaiting Settlement</span>}
                           </div>
                        </div>
                      ))}
                      {inquiries.length === 0 && <div className="p-20 text-center"><MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-4" /><p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">No recent activity nodes.</p></div>}
                   </div>
                </section>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="animate-fade-in space-y-10 text-left">
                <header>
                    <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-2 block tracking-tight">Global Representation</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic">Listing <span className="text-nature-600">Intelligence</span></h1>
                </header>
                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-nature-50 mb-6 bg-gray-50 group">
                        {profile?.image_url ? <img src={profile.image_url} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 gap-4">{role === 'guide' ? <User size={80} /> : <Tent size={80} />}</div>}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 cursor-pointer font-black uppercase text-[10px] tracking-widest transition-all"><Camera size={32} /> Update Node Asset <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" /></label>
                      </div>
                      <div className="w-full p-4 rounded-2xl bg-nature-50 border border-nature-100 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Active Discovery Node</span></div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-8">
                     <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Name</label><input type="text" name="name" value={profile?.name || ''} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none font-black text-gray-900 focus:bg-white focus:ring-4 focus:ring-nature-500/10 transition-all" required /></div>
                          <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{role === 'guide' ? 'Auth Status' : 'Session Price (PHP)'}</label>{role === 'guide' ? (<select name="accreditation_level" value={profile?.accreditation_level || ''} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none font-black text-gray-900 appearance-none"><option value="Local Expert">Local Expert</option><option value="DOT Accredited">DOT Accredited</option></select>) : (<input type="number" name="price_per_night" value={profile?.price_per_night || ''} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none font-black text-gray-900" />)}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geographic Node</label><input type="text" name="location" value={profile?.location || ''} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none font-black text-gray-900" /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Public Contact</label><input type="text" name="contact_number" value={profile?.contact_number || ''} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none font-black text-gray-900" /></div>
                        </div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Mission Statement / Narrative</label><textarea name={role === 'guide' ? 'bio' : 'description'} value={role === 'guide' ? profile?.bio : profile?.description} onChange={handleInputChange} rows="6" className="w-full px-8 py-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] outline-none font-medium text-gray-700 leading-relaxed resize-none focus:bg-white transition-all"></textarea></div>
                        <button disabled={saving} type="submit" className="w-full md:w-auto bg-nature-950 hover:bg-black text-white font-black py-6 px-16 rounded-[2.5rem] transition-all shadow-2xl flex items-center justify-center gap-4 uppercase text-xs tracking-widest">{saving ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : <Save size={20} />}{saving ? 'Synchronizing...' : 'Upload Configuration'}</button>
                     </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="animate-fade-in space-y-10 text-left">
                <header><span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-2 block tracking-tight">Active Engagement Hub</span><h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none italic">Experience <span className="text-nature-600">Pipeline</span></h1></header>
                <div className="grid grid-cols-1 gap-8">
                  {inquiries.map((item) => (
                    <div key={item.id} className={`bg-white p-10 rounded-[3rem] shadow-sm border transition-all duration-500 relative group overflow-hidden ${item.status === 'pending' ? 'border-orange-100' : 'border-gray-50 hover:shadow-2xl'}`}>
                      <div className="flex flex-col xl:flex-row justify-between gap-12">
                        <div className="flex-1 space-y-8">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full ${item.status === 'completed' ? 'bg-nature-900 text-nature-400' : item.status === 'confirmed' ? 'bg-green-100 text-green-700' : item.status === 'declined' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>{item.status} Status</span>
                            <span className="text-xs font-bold text-gray-300 flex items-center gap-2 font-mono uppercase tracking-widest"><Calendar size={14} /> Logged: {new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                          <div><h4 className="text-5xl font-black text-gray-900 tracking-tighter mb-2 italic leading-none">{item.guest_name}</h4><p className="font-bold text-gray-400 text-sm uppercase tracking-widest mb-4">Verification: {item.contact_details}</p><div className="flex flex-wrap gap-4"><div className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3 text-sm font-black text-gray-600"><Clock size={18} className="text-nature-600" /> Planned Node: {new Date(item.booking_date).toLocaleDateString()}</div>{item.payment_reference && <div className="px-6 py-3 bg-nature-950 text-nature-400 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><CreditCard size={18} /> TX: {item.payment_reference}</div>}</div></div>
                          {item.message && <blockquote className="text-xl text-gray-500 font-medium leading-relaxed border-l-4 border-nature-100 pl-8 italic">"{item.message}"</blockquote>}
                        </div>
                        <div className="flex flex-wrap xl:flex-col justify-center items-end gap-4 shrink-0 min-w-[250px] text-right">
                          {item.status === 'pending' && (<><button onClick={() => handleInquiryStatus(item.id, 'confirmed')} className="w-full bg-nature-600 hover:bg-nature-700 text-white p-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-nature-600/20 transition-all flex items-center justify-center gap-3"><CheckCircle size={18} /> Confirm Node</button><button onClick={() => handleInquiryStatus(item.id, 'declined')} className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-50 p-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all">Decline Submission</button></>)}
                          {item.status === 'confirmed' && (<button onClick={() => finalizeInquiry(item.id)} className="w-full bg-nature-950 hover:bg-black text-white p-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4"><DollarSign size={20} className="text-nature-400" /> Finalize Settlement</button>)}
                          {item.status === 'completed' && (<div className="text-right space-y-2"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Realized Impact</p><h4 className="text-5xl font-black text-nature-900 tracking-tighter leading-none">₱{Number(item.amount).toLocaleString()}</h4><div className="flex items-center justify-end gap-2 text-green-500 font-black uppercase text-[10px] tracking-widest"><CheckCircle size={14} /> Verified Settlement</div></div>)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {inquiries.length === 0 && <div className="py-40 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 text-center space-y-4"><MessageSquare size={48} className="text-gray-200 mx-auto" /><p className="text-gray-400 font-black uppercase tracking-widest text-xs">Waiting for ecosystem engagement nodes...</p></div>}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;

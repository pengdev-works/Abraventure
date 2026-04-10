import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, Map, Users as UsersIcon, Tent, Plus, MessageSquare, 
  LayoutDashboard, Download, ShieldCheck, Check, X, Shield, 
  Star, DollarSign, Navigation, Menu, Bell, Search, 
  ChevronLeft, Filter, MoreVertical, ArrowUpRight, TrendingUp,
  Edit3, Trash2, Camera, MapPin, Briefcase, CreditCard, History, BarChart3, Globe, Activity
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis,
  BarChart, Bar
} from 'recharts';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem('username') || 'Administrator';

  // State
  const [stats, setStats] = useState({ spots: 0, guides: 0, homestays: 0, inquiries: 0, pendingUsers: 0, totalImpact: 0 });
  const [items, setItems] = useState({ spots: [], guides: [], homestays: [], inquiries: [], users: [], auditLogs: [], municipalStats: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const results = await Promise.allSettled([
        axios.get(`${apiUrl}/spots`),
        axios.get(`${apiUrl}/guides`),
        axios.get(`${apiUrl}/homestays`),
        axios.get(`${apiUrl}/inquiries`, { headers }),
        axios.get(`${apiUrl}/admin/users`, { headers }),
        axios.get(`${apiUrl}/admin/audit-logs`, { headers }),
        axios.get(`${apiUrl}/admin/analytics/municipal`, { headers }),
        axios.get(`${apiUrl}/verified-impact`)
      ]);
      
      const spotsData = results[0].status === 'fulfilled' ? results[0].value.data : [];
      const guidesData = results[1].status === 'fulfilled' ? results[1].value.data : [];
      const homestaysData = results[2].status === 'fulfilled' ? results[2].value.data : [];
      const inquiriesData = results[3].status === 'fulfilled' ? results[3].value.data : [];
      const usersData = results[4].status === 'fulfilled' ? results[4].value.data : [];
      const auditData = results[5].status === 'fulfilled' ? results[5].value.data : [];
      const municipalData = results[6].status === 'fulfilled' ? results[6].value.data : [];
      const impactData = results[7].status === 'fulfilled' ? results[7].value.data : { total_impact: 0 };

      setItems({
        spots: spotsData,
        guides: guidesData,
        homestays: homestaysData,
        inquiries: inquiriesData,
        users: usersData,
        auditLogs: auditData,
        municipalStats: municipalData
      });
      
      setStats({
        spots: spotsData.length,
        guides: guidesData.length,
        homestays: homestaysData.length,
        inquiries: inquiriesData.filter(i => i.status === 'pending').length,
        pendingUsers: usersData.filter(u => u.status === 'pending').length,
        totalImpact: impactData.total_impact || 0
      });
    } catch (err) {
      console.error('Failed to fetch platform stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (editingId) {
        await axios.put(`${apiUrl}/${activeTab}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ icon: 'success', title: 'Update Confirmed', text: `Resource has been synchronized.`, timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${apiUrl}/${activeTab}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ icon: 'success', title: 'Asset Published', text: `New resource is now live.`, timer: 1500, showConfirmButton: false });
      }

      setFormData({});
      setEditingId(null);
      fetchStats();
    } catch (err) {
      Swal.fire('Error', 'Institutional record update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Confirm Deletion?',
      text: "This action will permanently remove the resource from institutional records.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Terminate',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (result.isConfirmed) {
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
        Swal.fire({ icon: 'success', title: 'Asset Purged', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', 'Deletion protocol failed.', 'error');
      }
    }
  };

  const handleUserStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      Swal.fire({ title: 'Adjudicating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      await axios.put(`${apiUrl}/admin/users/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchStats();
      Swal.fire({ icon: 'success', title: `Decision: ${newStatus}`, timer: 1500, showConfirmButton: false });
    } catch (err) {
       Swal.fire('Error', 'Adjudication failed.', 'error');
    }
  };

  const finalizeInquiry = async (id) => {
    const { value: amount } = await Swal.fire({
      title: 'Inquiry Adjudication',
      input: 'number',
      inputLabel: 'Verified Experience Amount (PHP)',
      inputPlaceholder: '2500.00',
      showCancelButton: true,
      customClass: { popup: 'rounded-[3rem]' }
    });

    if (amount) {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.put(`${apiUrl}/inquiries/${id}/status`, { status: 'completed', amount }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStats();
        Swal.fire({ icon: 'success', title: 'Experience Logged', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', 'Status transition failed.', 'error');
      }
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Ecosystem', icon: <LayoutDashboard size={18} /> },
    { id: 'analytics', label: 'Impact Hub', icon: <BarChart3 size={18} /> },
    { id: 'spots', label: 'Tourist Spots', icon: <Map size={18} /> },
    { id: 'guides', label: 'Accredited Guides', icon: <UsersIcon size={18} /> },
    { id: 'homestays', label: 'Homestays', icon: <Tent size={18} /> },
    { id: 'inquiries', label: 'Bookings', icon: <MessageSquare size={18} />, count: stats.inquiries },
    { id: 'users', label: 'Partner Requests', icon: <ShieldCheck size={18} />, count: stats.pendingUsers },
    { id: 'logs', label: 'Audit Trail', icon: <History size={18} /> },
  ];

  const colors = ['#43805f', '#a67c52', '#2d5a27', '#1e293b', '#0f172a'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-nature-950 space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-nature-600/20 border-t-nature-400 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-nature-600/40 border-b-nature-300 animate-spin-reverse"></div>
        </div>
        <p className="text-nature-300 font-black tracking-widest uppercase text-xs animate-pulse">Establishing Root Secure Link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-nature-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full bg-nature-900 text-white flex flex-col transition-all duration-500 ease-in-out
        ${sidebarCollapsed ? 'w-20' : 'w-72'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 w-6 h-6 bg-nature-800 border border-nature-700 rounded-full flex items-center justify-center text-nature-300 hover:text-white shadow-xl z-50 hidden md:flex"><ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`} /></button>
        <div className="p-8 pb-4 flex items-center gap-3 overflow-hidden text-left">
          <div className="w-10 h-10 bg-nature-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-nature-600/40"><Shield size={24} /></div>
          <span className={`font-black text-xl tracking-tighter text-white whitespace-nowrap transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>Abra<span className="text-nature-400">Admin</span></span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2 custom-scrollbar overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); setEditingId(null); setFormData({}); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative ${activeTab === item.id ? 'bg-nature-800 text-white' : 'text-nature-400 hover:bg-nature-800/50 hover:text-white'}`}><div className={`transition-all duration-300 ${activeTab === item.id ? 'scale-110 text-nature-400' : 'group-hover:scale-110'}`}>{item.icon}</div><span className={`font-bold text-sm transition-all duration-300 whitespace-nowrap ${sidebarCollapsed ? 'opacity-0 scale-90 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>{item.label}</span>{item.count > 0 && <span className={`absolute right-4 bg-nature-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-nature-900 ${sidebarCollapsed ? 'top-2 right-2' : ''}`}>{item.count}</span>}</button>
          ))}
        </nav>
        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-nature-400 font-bold transition-all hover:bg-red-500/10 hover:text-red-400 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}><LogOut size={18} /><span className={`whitespace-nowrap font-black uppercase text-[10px] tracking-[0.2em] ${sidebarCollapsed ? 'hidden' : 'block'}`}>Terminate</span></button>
        </div>
      </aside>

      {/* Main UI */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => setMobileMenuOpen(true)} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 md:hidden"><Menu className="w-6 h-6" /></button>
             <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none block mb-1">Administrative Node</span>
                <h2 className="text-xl font-bold text-gray-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <button className="relative w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nature-600 transition-colors"><Bell size={18} /><span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
             <div className="h-8 w-px bg-gray-100"></div>
             <div className="flex items-center gap-4 text-left">
                <div className="hidden sm:block">
                   <p className="text-xs font-black text-gray-900 uppercase leading-none tracking-tight">System Root</p>
                   <p className="text-[10px] font-bold text-nature-600 uppercase tracking-widest mt-1">Status: Operational</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-nature-900 flex items-center justify-center text-nature-400 font-black shadow-lg shadow-nature-900/10 ring-4 ring-nature-50 uppercase">{adminUsername.charAt(0)}</div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8F9FA]/30 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12 pb-24">
            
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-fade-in text-left">
                <section>
                   <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2 italic">Platform <span className="text-nature-600">Health</span></h1>
                   <p className="text-lg text-gray-500 font-medium tracking-tight">Real-time ecosystem analytics and operational metrics.</p>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Ecosystem Impact', val: `₱${(stats.totalImpact / 1000).toFixed(1)}k`, icon: <TrendingUp size={24} />, color: 'nature' },
                    { label: 'Accredited Guides', val: stats.guides, icon: <UsersIcon size={24} />, color: 'earth' },
                    { label: 'Verified Homestays', val: stats.homestays, icon: <Tent size={24} />, color: 'green' },
                    { label: 'Operational Queue', val: stats.inquiries + stats.pendingUsers, icon: <Activity size={24} />, color: 'red' }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500">
                      <div className={`w-14 h-14 bg-gray-50 text-nature-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">{stat.val}</h3>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <section className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 space-y-8">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Operational Engagement</h3>
                      <div className="h-[300px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{ name: 'Jan', val: 400 }, { name: 'Feb', val: 700 }, { name: 'Mar', val: 600 }, { name: 'Apr', val: 900 }]}>
                               <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#43805f" stopOpacity={0.1}/><stop offset="95%" stopColor="#43805f" stopOpacity={0}/></linearGradient></defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><RechartsTooltip /><Area type="monotone" dataKey="val" stroke="#43805f" strokeWidth={4} fill="url(#colorVal)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </section>
                   <section className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 flex flex-col items-center">
                      <div className="w-full text-left mb-8"><h3 className="text-2xl font-black text-gray-900 tracking-tight">Resource Split</h3></div>
                      <div className="h-[250px] w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Spots', value: stats.spots }, { name: 'Guides', value: stats.guides }, { name: 'Homestays', value: stats.homestays }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{[0,1,2].map(i => <Cell key={i} fill={colors[i]} />)}</Pie><RechartsTooltip /></PieChart></ResponsiveContainer></div>
                      <div className="mt-6 flex flex-wrap justify-center gap-4">
                         {['Spots', 'Guides', 'Homestays'].map((l, i) => (
                           <div key={i} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }}></div><span className="text-[10px] font-black uppercase text-gray-400">{l}</span></div>
                         ))}
                      </div>
                   </section>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="animate-fade-in space-y-12 text-left">
                 <header>
                    <span className="text-nature-600 font-black uppercase tracking-widest text-[10px] mb-2 block">Institutional Intelligence</span>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic leading-none">Impact <span className="text-nature-600">Command Center</span></h1>
                 </header>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <section className="bg-nature-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-nature-400/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                       <div className="relative z-10 space-y-8">
                          <h3 className="text-2xl font-black text-white italic tracking-tighter">Municipal Revenue Distribution</h3>
                          <div className="h-[350px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={items.municipalStats}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                   <XAxis dataKey="municipality" axisLine={false} tickLine={false} tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                   <RechartsTooltip contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} />
                                   <Bar dataKey="total_revenue" radius={[10, 10, 0, 0]} fill="#43805f" />
                                </BarChart>
                             </ResponsiveContainer>
                          </div>
                       </div>
                    </section>

                    <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col">
                       <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter mb-8">Node Adjudication Matrix</h3>
                       <div className="space-y-6 flex-1">
                          {items.municipalStats.slice(0, 5).map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-nature-50 hover:border-nature-100 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-nature-600 font-black">{i + 1}</div>
                                  <div><p className="font-black text-gray-900 leading-none mb-1">{node.municipality}</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{node.completed_sessions} Confirmed Nodes</p></div>
                               </div>
                               <div className="text-right">
                                  <p className="text-xl font-black text-nature-900 tracking-tighter leading-none">₱{Number(node.total_revenue).toLocaleString()}</p>
                                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mt-1">Institutional Impact</p>
                               </div>
                            </div>
                          ))}
                          {items.municipalStats.length === 0 && <div className="flex-1 flex items-center justify-center text-gray-200 uppercase font-black tracking-widest text-xs">Awaiting verified revenue nodes</div>}
                       </div>
                    </section>
                 </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="animate-fade-in space-y-10 text-left">
                <header>
                   <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-2 block">Security & Accountability</span>
                   <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Governance <span className="text-nature-600">Audit Trail</span></h1>
                </header>
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50 border-b border-gray-100"><tr className="text-[10px] font-black uppercase tracking-widest text-gray-400"><th className="px-10 py-6">Timestamp</th><th className="px-10 py-6">Adjudicator</th><th className="px-10 py-6">Operation</th><th className="px-10 py-6">Details</th></tr></thead>
                         <tbody className="divide-y divide-gray-50">
                            {items.auditLogs.map(log => (
                              <tr key={log.id} className="text-sm">
                                 <td className="px-10 py-6 font-mono text-gray-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                                 <td className="px-10 py-6 font-black text-gray-900">{log.username}</td>
                                 <td className="px-10 py-6"><span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${log.action.includes('DELETE') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{log.action}</span></td>
                                 <td className="px-10 py-6 text-gray-500 font-medium">{log.details}</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              </div>
            )}

            {(activeTab === 'spots' || activeTab === 'guides' || activeTab === 'homestays') && (
              <div className="animate-fade-in space-y-12 text-left">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div>
                      <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-2 block">Institutional Inventory</span>
                      <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic capitalize">Manage <span className="text-nature-600">{activeTab}</span></h1>
                   </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   {/* Management Form */}
                   <div className="lg:col-span-1">
                      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8 sticky top-8">
                         <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                           {editingId ? <Edit3 className="text-nature-600" /> : <Plus className="text-nature-600" />}
                           {editingId ? 'Edit Record' : 'Publish Asset'}
                         </h3>
                         <div className="space-y-6">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Nomenclature</label>
                               <input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-600 outline-none transition-all font-bold text-gray-900" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{activeTab === 'guides' ? 'Specialization' : 'Geographical Node'}</label>
                               <input required name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-600 outline-none transition-all font-bold text-gray-900" />
                            </div>
                            {activeTab === 'guides' && (
                               <div className="space-y-1">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Auth Level</label>
                                  <select name="accreditation_level" value={formData.accreditation_level || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900">
                                     <option value="Local Expert">Local Expert</option>
                                     <option value="DOT Accredited">DOT Accredited</option>
                                  </select>
                               </div>
                            )}
                            {activeTab === 'homestays' && (
                               <div className="space-y-1">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daily Rate (PHP)</label>
                                  <input type="number" name="price_per_night" value={formData.price_per_night || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900" />
                                </div>
                            )}
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Narrative Content</label>
                               <textarea required name={activeTab === 'spots' ? 'description' : (activeTab === 'guides' ? 'bio' : 'description')} value={formData.description || formData.bio || ''} onChange={handleInputChange} rows="4" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-gray-700 resize-none"></textarea>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visual Evidence</label>
                               <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-nature-300 transition-all cursor-pointer">
                                  {formData.image_url ? (
                                    <img src={formData.image_url} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                      <Camera size={32} />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Upload Resource</span>
                                    </div>
                                  )}
                                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-4">
                           {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="flex-1 py-4 px-6 rounded-2xl border border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>}
                           <button disabled={saving} type="submit" className="flex-[2] bg-nature-900 hover:bg-black text-white py-4 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-nature-900/40 transition-all flex items-center justify-center gap-3">
                             {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div> : (editingId ? <Check size={18}/> : <Plus size={18}/>)}
                             {editingId ? 'Confirm Update' : 'Publish Asset'}
                           </button>
                         </div>
                      </form>
                   </div>

                   {/* Inventory List */}
                   <div className="lg:col-span-2 space-y-6">
                      {items[activeTab].map(item => (
                        <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center group hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                           {editingId === item.id && <div className="absolute top-0 left-0 w-2 h-full bg-nature-600"></div>}
                           <div className="w-full md:w-48 aspect-video rounded-[1.5rem] overflow-hidden bg-gray-100 shrink-0">
                              {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><Map size={48} /></div>}
                           </div>
                           <div className="flex-1 text-left min-w-0">
                              <span className="text-[10px] font-black text-nature-600 uppercase tracking-widest mb-1 block">{item.accreditation_level || (activeTab === 'homestays' ? `₱${item.price_per_night}` : 'Tourism Asset')}</span>
                              <h4 className="text-3xl font-black text-gray-900 tracking-tighter truncate leading-none mb-3">{item.name}</h4>
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><MapPin size={12} className="text-nature-400" /> {item.location}</div>
                              <p className="mt-4 text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description || item.bio}</p>
                           </div>
                           <div className="flex md:flex-col gap-3 shrink-0">
                              <button onClick={() => handleEdit(item)} className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-nature-900 hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                              <button onClick={() => handleDelete(item.id)} className="p-4 rounded-2xl bg-gray-50 text-red-300 hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                           </div>
                        </div>
                      ))}
                      {items[activeTab].length === 0 && (
                         <div className="py-40 bg-white rounded-[3rem] border border-dashed border-gray-100 text-center"><p className="font-black text-gray-200 uppercase tracking-widest">No assets logged in {activeTab}</p></div>
                      )}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="animate-fade-in space-y-10 text-left">
                <header>
                   <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-2 block">Security & Governance</span>
                   <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Partner <span className="text-nature-600">Verification</span></h1>
                </header>
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                   <div className="overflow-x-auto text-left">
                     <table className="w-full">
                       <thead className="bg-[#F8F9FA] border-b border-gray-100">
                         <tr><th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Applicant Identity</th><th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Entity Role</th><th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Adjudication</th></tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {items.users.map(user => (
                            <tr key={user.id} className="hover:bg-nature-50/10 group transition-all">
                               <td className="px-10 py-8"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-nature-900 text-nature-400 flex items-center justify-center font-black uppercase">{user.username.charAt(0)}</div><div><p className="font-black text-gray-900 leading-none mb-1">{user.username}</p><p className="text-xs text-gray-400 font-bold uppercase">{user.email}</p></div></div></td>
                               <td className="px-10 py-8"><span className="text-xs font-black text-nature-700 bg-nature-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{user.role.replace('_', ' ')}</span></td>
                               <td className="px-10 py-8 text-right"><div className="flex justify-end gap-3">{user.status === 'pending' ? (<><button onClick={() => handleUserStatus(user.id, 'approved')} className="bg-nature-600 text-white p-3 rounded-2xl hover:bg-nature-700 shadow-xl transition-all"><Check size={20}/></button><button onClick={() => handleUserStatus(user.id, 'rejected')} className="bg-white text-red-600 border border-red-100 p-3 rounded-2xl hover:bg-red-100 transition-all"><X size={20}/></button></>) : (<button onClick={() => handleUserStatus(user.id, 'pending')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-nature-600">Reset Node</button>)}</div></td>
                            </tr>
                          ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="animate-fade-in space-y-10 text-left">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div>
                      <span className="text-nature-600 font-black uppercase tracking-widest text-xs mb-2 block tracking-tight">Financial & Experience Log</span>
                      <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Platform <span className="text-nature-600">Bookings</span></h1>
                   </div>
                </header>
                <div className="grid grid-cols-1 gap-6">
                  {items.inquiries.map(item => (
                    <div key={item.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between gap-10 hover:shadow-2xl transition-all duration-500 overflow-hidden relative text-left">
                       <div className="flex-1 space-y-6">
                          <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ${
                              item.status === 'completed' ? 'bg-nature-100 text-nature-700' : 
                              item.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {item.status} Node
                            </span>
                            {item.status === 'confirmed' && <button onClick={() => finalizeInquiry(item.id)} className="text-[10px] font-black uppercase text-nature-600 hover:underline">Mark Completed</button>}
                          </div>
                          <h4 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{item.guest_name}</h4>
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Target: {item.target_name || item.target_id}</p>
                          <div className="flex gap-6 mt-8 pt-8 border-t border-gray-50"><div><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Contact</p><p className="font-bold text-gray-900 text-sm">{item.contact_details}</p></div><div><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Date</p><p className="font-bold text-gray-900 text-sm">{new Date(item.booking_date).toLocaleDateString()}</p></div></div>
                       </div>
                       <div className="xl:border-l border-gray-50 xl:pl-10 flex flex-col justify-center items-end min-w-[220px] text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Geospatial Settlement</p>
                          <h4 className="text-4xl font-black text-gray-900 tracking-tighter">
                            {item.amount > 0 ? `₱${Number(item.amount).toLocaleString()}` : <span className="text-gray-200">Pending</span>}
                          </h4>
                          <div className="mt-4 flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Verification</span>
                             <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center ${item.status === 'completed' ? 'bg-nature-50 border-nature-100 text-nature-600' : 'border-gray-50 text-gray-200'}`}><Check size={16}/></div>
                          </div>
                       </div>
                    </div>
                  ))}
                  {items.inquiries.length === 0 && <div className="py-40 bg-white rounded-[3rem] border border-dashed border-gray-100 text-center text-gray-200 uppercase font-black tracking-widest">Awaiting engagement nodes</div>}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

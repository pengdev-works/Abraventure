import { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Mail, User, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import axios from 'axios';

const InquiryModal = ({ isOpen, onClose, targetItem, type }) => {
  const [formData, setFormData] = useState({
    guest_name: '',
    contact_details: '',
    booking_date: '',
    message: '',
    payment_reference: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  if (!isOpen || !targetItem) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/inquiry`, {
        type: type,
        target_id: targetItem.id,
        ...formData
      });

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ guest_name: '', contact_details: '', booking_date: '', message: '', payment_reference: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setStatus('error');
    }
  };

  const isHomestay = type === 'homestay';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-nature-950/60 backdrop-blur-md transition-all duration-500 animate-fade-in">
      <div className={`
        bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative transform transition-all duration-500
        ${status === 'submitting' ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
      `}>
        {/* Institutional Header */}
        <div className="bg-nature-900 px-10 py-8 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-nature-600/20 rounded-full blur-[40px] -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nature-400 mb-1 block">Sanctuary Gateway</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter italic">
              {isHomestay ? `Request ${targetItem.name}` : `Consult ${targetItem.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="relative z-10 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group">
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar text-left">
          {status === 'success' ? (
            <div className="py-20 text-center animate-fade-in">
              <div className="w-24 h-24 bg-nature-50 text-nature-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-nature-600/10 ring-8 ring-nature-50/50">
                <Check size={48} className="animate-bounce" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 italic">Protocol Initiated.</h3>
              <p className="text-gray-500 font-medium max-w-xs mx-auto">Your institutional inquiry is being processed. The {isHomestay ? 'host' : 'expert'} will contact you via your provided credentials.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Payment Instruction Card */}
              <div className="bg-blue-900 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-blue-900/10 border border-blue-800 transition-all hover:bg-blue-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">GCash Settlement Node</span>
                     <CreditCard size={18} className="text-blue-200" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-blue-200/60 uppercase tracking-widest mb-1 leading-none">Institutional Account</span>
                     <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">0966 8579 216</span>
                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2">Provincial Tourism Bureau</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-300" />
                     <p className="text-[10px] font-bold text-blue-200 leading-relaxed italic">Synchronize your 13-digit Reference Number to establish verification.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <User size={12} className="text-nature-600" /> Traveler Identity
                    </label>
                    <input
                      type="text" required name="guest_name" value={formData.guest_name} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-600 outline-none transition-all font-bold text-gray-900"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Mail size={12} className="text-nature-600" /> Secure Contact
                    </label>
                    <input
                      type="text" required name="contact_details" value={formData.contact_details} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-600 outline-none transition-all font-bold text-gray-900"
                      placeholder="Email or Connectivity ID"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <CreditCard size={12} className="text-blue-600" /> GCash Settlement Ref
                    </label>
                    <input
                      type="text" required name="payment_reference" value={formData.payment_reference} onChange={handleChange}
                      className="w-full px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-black text-blue-900"
                      placeholder="Institutional 13-digit Ref"
                      maxLength="13"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Calendar size={12} className="text-nature-600" /> Scheduled Arrival
                    </label>
                    <input
                      type="date" required name="booking_date" value={formData.booking_date} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-600 outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                   <MessageSquare size={12} className="text-nature-600" /> Special Requirements
                </label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange} rows="3"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-600 outline-none transition-all font-medium text-gray-700 resize-none"
                  placeholder="Operational notes or specific inquiries..."
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 font-bold text-xs">
                   <X size={16} /> Operational link interrupted. Please retry.
                </div>
              )}

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-5 rounded-3xl border border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Terminate Request
                </button>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex-[2] bg-nature-900 text-white font-black px-10 py-5 rounded-3xl shadow-2xl shadow-nature-900/40 hover:bg-black transition-all disabled:opacity-70 flex justify-center items-center gap-3 group"
                >
                  {status === 'submitting' ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  ) : <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                  <span className="text-[10px] tracking-[0.3em] uppercase">{status === 'submitting' ? 'Transmitting...' : 'Initiate Adjudication'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;

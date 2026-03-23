import { useState } from 'react';
import { X } from 'lucide-react';
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
      }, 2500);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative transform transition-all">
        <div className="bg-nature-800 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">
            {type === 'homestay' ? `Book ${targetItem.name}` : `Contact ${targetItem.name}`}
          </h2>
          <button onClick={onClose} className="text-nature-200 hover:text-white transition-colors p-1 rounded-full hover:bg-nature-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
              <p className="text-gray-600">The {type === 'homestay' ? 'host' : 'guide'} will contact you soon to confirm.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  GCash Payment Instructions
                </h4>
                <p className="text-xs text-blue-800 mb-2">Please send the exact booking amount via GCash to secure your reservation.</p>
                <div className="bg-white px-3 py-2 rounded border border-blue-200 inline-block mb-3">
                  <span className="font-mono font-bold text-lg text-gray-900">09668579216</span>
                  <span className="block text-xs text-gray-500">Provincial Tourism Office</span>
                </div>
                <p className="text-xs text-blue-700 italic border-t border-blue-200/50 pt-2">
                  Ensure to copy the 13-digit Reference Number from your GCash receipt to complete this booking.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" required name="guest_name" value={formData.guest_name} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details (Email or Phone)</label>
                <input
                  type="text" required name="contact_details" value={formData.contact_details} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
                  placeholder="09123456789 or juan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GCash Reference No.</label>
                <input
                  type="text" required name="payment_reference" value={formData.payment_reference} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 font-mono"
                  placeholder="e.g. 1205678901234"
                  maxLength="13"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date" required name="booking_date" value={formData.booking_date} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange} rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all resize-none"
                  placeholder="Any special requests or questions?"
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  Failed to send inquiry. Please try again.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-nature-600 hover:bg-nature-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 flex justify-center items-center"
                >
                  {status === 'submitting' ? (
                    <span className="inline-block animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></span>
                  ) : null}
                  {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
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

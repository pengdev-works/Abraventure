import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Users, Tent, Building } from 'lucide-react';
import Swal from 'sweetalert2';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'guide' // Default role
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: 'Submitting Application...',
      html: 'Processing your partner registration and establishing credentials.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/auth/register`, formData);
      
      Swal.close();
      
      Swal.fire({
        icon: 'success',
        title: 'Application Received',
        text: 'Your partner registration has been submitted successfully and is now awaiting administrative review.',
        confirmButtonColor: '#43805f',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3'
        }
      });

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: err.response?.data?.error || 'Unable to process registration. Please try again.',
        confirmButtonColor: '#b91c1c',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3'
        }
      });
      setLoading(false);
    }
  };

  const roles = [
    { 
      id: 'guide', 
      title: 'Tour Guide', 
      desc: 'Expert in local spots, culture, and nature trails.', 
      icon: <Users className="w-8 h-8" />,
      color: 'bg-nature-500'
    },
    { 
      id: 'homestay_owner', 
      title: 'Homestay Owner', 
      desc: 'Provider of authentic local accommodations.', 
      icon: <Tent className="w-8 h-8" />,
      color: 'bg-earth-500'
    }
  ];

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Register Info & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-nature-950">
        <div className="absolute inset-0 bg-nature-900/60 z-10"></div>
        <img 
          src="/article-cover-photo-abra.webp" 
          alt="Abra Heritage" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 animate-slow-zoom"
        />
        
        <div className="relative z-20 flex flex-col justify-between p-16 w-full text-white">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-black text-3xl tracking-tighter text-white">Abra<span className="text-nature-400 group-hover:text-nature-300 transition-colors">Venture</span></span>
          </Link>

          <div className="space-y-8 text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-widest text-nature-300">
              <Building className="w-4 h-4 mr-2" />
              Partner Application
            </div>
            <h2 className="text-6xl font-black tracking-tight leading-none text-white">
              Launch Your <br/><span className="text-nature-400">Tourism Business</span>
            </h2>
            <p className="text-xl text-white/70 max-w-lg font-medium leading-relaxed">
              Join the official AbraVenture ecosystem and start reaching travelers from across the globe.
            </p>

            <div className="space-y-4 pt-4">
               {[
                 "Direct integration into the AbraVenture discovery engine",
                 "Streamlined inquiry and booking management",
                 "Verified partner badge for trust and authenticity",
                 "Local community support and DOT-accreditation pathways"
               ].map((benefit, i) => (
                 <div key={i} className="flex items-center space-x-3 text-white/80 font-medium overflow-hidden">
                   <div className="w-5 h-5 bg-nature-500 rounded-full flex items-center justify-center flex-shrink-0">
                     <ShieldCheck className="w-3 h-3 text-white" />
                   </div>
                   <span className="truncate">{benefit}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="text-sm font-bold text-white/40 tracking-widest uppercase text-left">
            Built for the community of Abra
          </div>
        </div>
      </div>

      {/* Right Side: Registration Steps */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nature-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-earth-50 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="w-full max-w-xl space-y-12">
          <div className="text-left space-y-4">
            <div className="flex items-center justify-between">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                 {step === 1 ? 'Choose Your Role' : 'Create Your Account'}
               </h1>
               <span className="text-sm font-black text-gray-400 whitespace-nowrap ml-4">Step {step} of 2</span>
            </div>
            <p className="text-gray-500 font-medium">
              {step === 1 
                ? 'Select how you want to participate in the AbraVenture ecosystem.' 
                : 'Enter your professional credentials to begin your journey.'}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setFormData({...formData, role: role.id});
                      setStep(2);
                    }}
                    className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-left flex items-start space-x-6 card-hover ${
                      formData.role === role.id 
                        ? 'border-nature-600 bg-nature-50/50 shadow-xl' 
                        : 'border-gray-100 bg-white hover:border-nature-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      formData.role === role.id ? role.color + ' text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-nature-100 group-hover:text-nature-600'
                    }`}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{role.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">{role.desc}</p>
                    </div>
                    <div className={`absolute top-8 right-8 transition-transform duration-300 ${formData.role === role.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                      <ArrowRight className="w-6 h-6 text-nature-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-8 animate-fade-in text-left">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-nature-600">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text" required
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-500 outline-none transition-all duration-300 font-medium"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-nature-600">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-500 outline-none transition-all duration-300 font-medium"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-nature-600">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-600 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password" required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nature-500/10 focus:border-nature-500 outline-none transition-all duration-300 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center px-8 py-5 border-2 border-gray-100 rounded-2xl text-lg font-black text-gray-600 hover:bg-gray-50 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-8 py-5 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-nature-600 hover:bg-nature-700 focus:outline-none focus:ring-4 focus:ring-nature-500/50 transition-all duration-300 disabled:opacity-50 btn-hover"
                >
                  {loading ? 'Processing...' : 'Complete Application'}
                  {!loading && <ShieldCheck className="ml-2 w-5 h-5" />}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-500 font-medium">
            Already have a partner account?{' '}
            <Link to="/login" className="text-nature-600 font-black hover:text-nature-700 transition-colors underline decoration-2 underline-offset-4 decoration-nature-200">
              Sign In
            </Link>
          </p>

          <div className="pt-8 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 tracking-widest uppercase">
            <span>© 2026 AbraVenture</span>
            <div className="flex space-x-4">
               <span className="text-nature-600 uppercase">Selected Role: {formData.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

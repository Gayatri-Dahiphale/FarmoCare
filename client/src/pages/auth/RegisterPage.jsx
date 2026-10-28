import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Lock, User, Phone, Mail, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    village: '',
    district: '',
    state: 'Maharashtra',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.email && !formData.phone) {
      setError('Please provide at least an email address or mobile number.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        password: formData.password,
        location: {
          village: formData.village,
          district: formData.district,
          state: formData.state,
        },
      });
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 bg-pale-green/20">
      <div className="max-w-4xl w-full bg-white rounded-2xl border border-charcoal-border shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Split-Screen Farmer Photography */}
        <div className="lg:col-span-5 relative bg-forest overflow-hidden min-h-[220px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-8 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/auth_split_farmer.png"
              alt="Maharashtra farmer in fertile agricultural field"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest/75 to-black/20" />
          </div>

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sprout className="w-6 h-6 text-sage-light" />
            </div>
            <span className="font-extrabold tracking-tight text-white font-serif text-lg">
              Farmora<span className="text-sage-light">Care</span>
            </span>
          </div>

          <div className="relative z-10 space-y-2 mt-auto pt-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-sage-light">
              Join 100,000+ Cultivators
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Direct Agronomy Advisory for Your Farm
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Register free to submit crop photos, receive pest diagnosis, and track field recovery.
            </p>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-center bg-white">
          {/* Brand Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-forest">Farmer Registration</h1>
            <p className="text-xs text-charcoal-muted">
              Join the digital agronomy network to report crop health issues and receive university advisory.
            </p>
          </div>

          {/* Role Onboarding Explanatory Banner */}
          <div className="card-farm p-3 bg-sprout/40 border-leaf/30 flex items-start gap-2.5 text-xs text-forest">
            <ShieldCheck className="w-4 h-4 text-farm shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Public Registration is for Cultivators.</strong> Agriculture Expert and Administrative accounts require authorized institutional accreditation by the State Directorate.
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="e.g. Ramesh Narayan Patil"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-farm pl-10"
                />
                <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 9822000005"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-farm pl-10"
                  />
                  <Phone className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. farmer@farmora.care"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-farm pl-10"
                  />
                  <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Village / Locality
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="village"
                    placeholder="e.g. Karmala"
                    value={formData.village}
                    onChange={handleChange}
                    className="input-farm pl-10"
                  />
                  <MapPin className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  name="district"
                  placeholder="e.g. Solapur / Nashik / Pune"
                  value={formData.district}
                  onChange={handleChange}
                  className="input-farm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-farm pl-10"
                  />
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-farm pl-10"
                  />
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold shadow-md mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register & Create Profile
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-charcoal-border">
            <p className="text-xs text-charcoal-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-farm hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

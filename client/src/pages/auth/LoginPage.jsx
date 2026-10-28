import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || '').toUpperCase();
      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'FARMER') {
        navigate('/farmer/dashboard', { replace: true });
      } else if (role === 'EXPERT') {
        navigate('/expert/dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, from, navigate]);

  const performLogin = async (emailToUse, passToUse) => {
    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(emailToUse, passToUse);
      const role = (loggedInUser?.role || '').toUpperCase();
      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'EXPERT') {
        navigate('/expert/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(identifier, password);
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 bg-pale-green/20">
      <div className="max-w-4xl w-full bg-white rounded-2xl border border-charcoal-border shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Farmer Split-Screen Photography */}
        <div className="lg:col-span-5 relative bg-forest overflow-hidden min-h-[220px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/auth_split_farmer.png"
              alt="Maharashtra farmer standing in lush green crop field"
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
              Official Agronomy Network
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Empowering Cultivators with University Advisory
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Fast, accountable diagnosis for crops across Maharashtra with verified scientific protocols.
            </p>
          </div>
        </div>

        {/* Right Column: Sign In Form & Fast Role Access */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-center bg-white">
          {/* Brand Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-forest font-serif">{t('signInTitle', 'Sign In to Farmora Care')}</h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('signInSubtitle', 'Access your agricultural problem reports, case history, or specialist diagnostic desk.')}
            </p>
          </div>


          {/* Login Form */}
          <div className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('emailPhoneLabel', 'Email or Mobile Number')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    id="login-email-input"
                    placeholder="ramesh.patil@farmora.care"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('passwordLabel', 'Password')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    id="login-password-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-md cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t('signInButton', 'Sign In to Dashboard')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-200">
              <p className="text-xs text-slate-500">
                {t('dontHaveAccount', "Don't have a registered account yet?")}{' '}
                <Link to="/register" className="font-bold text-farm-green hover:underline">
                  {t('registerFarmer', 'Register as a Farmer')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}


import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/apiClient';
import {
  Sprout,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  PlusCircle,
  FileText,
  BarChart2,
  Shield,
  Layers,
  CheckCircle,
  Briefcase,
  Activity,
  Globe
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const role = (user?.role || '').toUpperCase();

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.get('/notifications')
        .then((res) => {
          if (typeof res.unreadCount === 'number') {
            setUnreadCount(res.unreadCount);
          } else if (typeof res.data?.unreadCount === 'number') {
            setUnreadCount(res.data.unreadCount);
          } else {
            const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
            setUnreadCount(list.filter((n) => !n.isRead).length);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-[15px] sm:text-base font-semibold transition-all duration-150 px-3.5 py-2 rounded-xl ${
      isActive
        ? 'text-forest-green bg-light-green font-bold shadow-2xs'
        : 'text-slate-700 hover:text-forest-green hover:bg-pale-green'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-light-green/60 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-forest-green flex items-center justify-center text-white shadow-sm group-hover:bg-farm-green transition-colors">
              <Sprout className="w-6.5 h-6.5 text-fresh-sage" />
            </div>
            <div>
              <span className="text-2xl sm:text-[25px] font-extrabold tracking-tight text-forest-green block leading-none font-serif">
                Farmora<span className="text-farm-green">Care</span>
              </span>
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mt-0.5 block">
                {t('appTagline', 'Agronomy Support')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <NavLink to="/" className={navLinkClass}>{t('home')}</NavLink>
                <NavLink to="/how-it-works" className={navLinkClass}>{t('howItWorks')}</NavLink>
                <NavLink to="/about" className={navLinkClass}>{t('about')}</NavLink>
                <NavLink to="/contact" className={navLinkClass}>{t('contact')}</NavLink>
              </>
            ) : role === 'FARMER' ? (
              <>
                <NavLink to="/farmer/dashboard" className={navLinkClass}>{t('dashboard')}</NavLink>
                <NavLink to="/farmer/new-report" className={navLinkClass}>{t('reportProblem')}</NavLink>
                <NavLink to="/farmer/reports" className={navLinkClass}>{t('myReports')}</NavLink>
                <NavLink to="/farmer/profile" className={navLinkClass}>{t('farmProfile')}</NavLink>
              </>
            ) : role === 'EXPERT' ? (
              <>
                <NavLink to="/expert/dashboard" className={navLinkClass}>{t('dashboard')}</NavLink>
                <NavLink to="/expert/cases" className={navLinkClass}>{t('assignedCases')}</NavLink>
                <NavLink to="/expert/similar" className={navLinkClass}>{t('solvedRepository')}</NavLink>
                <NavLink to="/expert/formulary" className={navLinkClass}>{t('formulary')}</NavLink>
                <NavLink to="/expert/inspection" className={navLinkClass}>{t('fieldInspection')}</NavLink>
                <NavLink to="/expert/profile" className={navLinkClass}>{t('profile')}</NavLink>
              </>
            ) : role === 'ADMIN' ? (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>{t('dashboard')}</NavLink>
                <NavLink to="/admin/unassigned" className={navLinkClass}>{t('unassignedQueue')}</NavLink>
                <NavLink to="/admin/reports" className={navLinkClass}>{t('allReports')}</NavLink>
                <NavLink to="/admin/farmers" className={navLinkClass}>{t('farmers')}</NavLink>
                <NavLink to="/admin/experts" className={navLinkClass}>{t('experts')}</NavLink>
                <NavLink to="/admin/crops" className={navLinkClass}>{t('crops')}</NavLink>
                <NavLink to="/admin/categories" className={navLinkClass}>{t('categories')}</NavLink>
                <NavLink to="/admin/analytics" className={navLinkClass}>{t('analytics')}</NavLink>
              </>
            ) : null}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-2 bg-pale-green/60 px-3 py-2 rounded-xl border border-light-green text-sm font-semibold text-forest-green shadow-xs hover:border-farm-green transition-colors">
              <Globe className="w-4 h-4 text-farm-green shrink-0" />
              <select
                id="language-selector"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-forest-green focus:outline-none cursor-pointer pr-1"
                aria-label={t('language')}
              >
                <option value="en">English</option>
                <option value="mr">मराठी (MR)</option>
                <option value="hi">हिंदी (HI)</option>
              </select>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/diagnostics"
                  className="p-2.5 text-slate-500 hover:text-forest-green hover:bg-pale-green rounded-xl transition-colors"
                  title="System Diagnostics & Edge Status"
                >
                  <Activity className="w-5 h-5 text-farm-green" />
                </Link>

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2.5 rounded-xl text-slate-700 hover:bg-pale-green transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-forest-green" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Role Pill & User Info */}
                <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
                  <div className="text-right">
                    <Link to="/settings" className="text-sm font-bold text-forest-green truncate max-w-[150px] block hover:underline">
                      {user?.name || user?.fullName || 'User'}
                    </Link>
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-light-green text-forest-green">
                      {role}
                    </span>
                  </div>

                  <Link
                    to="/settings"
                    className="p-2 text-slate-500 hover:text-forest-green hover:bg-pale-green rounded-xl transition-colors"
                    title="Account Settings"
                  >
                    <User className="w-4.5 h-4.5" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title={t('signOut')}
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-base font-semibold text-forest-green hover:bg-pale-green rounded-xl transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/farmer/new-report"
                  className="btn-primary text-sm py-2 px-4 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('reportProblem')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && (
              <Link to="/notifications" className="p-2 relative text-forest-green">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full" />
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-pale-green transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Home</Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">How It Works</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">About</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Contact</Link>
              <div className="pt-2 flex flex-col gap-2 border-t border-slate-200">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full text-center">Sign In</Link>
                <Link to="/farmer/new-report" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center">Report a Problem</Link>
              </div>
            </div>
          ) : role === 'FARMER' ? (
            <div className="flex flex-col gap-1.5">
              <Link to="/farmer/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Dashboard</Link>
              <Link to="/farmer/new-report" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Report a Problem</Link>
              <Link to="/farmer/reports" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">My Reports</Link>
              <Link to="/farmer/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Farm Profile</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Account Settings</Link>
              <button onClick={handleLogout} className="mt-2 text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl">Sign Out</button>
            </div>
          ) : role === 'EXPERT' ? (
            <div className="flex flex-col gap-1.5">
              <Link to="/expert/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Dashboard</Link>
              <Link to="/expert/cases" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Assigned Cases</Link>
              <Link to="/expert/similar" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Solved Repository</Link>
              <Link to="/expert/formulary" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Formulary</Link>
              <Link to="/expert/inspection" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Field Inspection</Link>
              <Link to="/expert/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Profile</Link>
              <button onClick={handleLogout} className="mt-2 text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl">Sign Out</button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Dashboard</Link>
              <Link to="/admin/unassigned" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Unassigned Queue</Link>
              <Link to="/admin/reports" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">All Reports</Link>
              <Link to="/admin/farmers" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Farmers</Link>
              <Link to="/admin/experts" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Experts</Link>
              <Link to="/admin/crops" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Crops</Link>
              <Link to="/admin/categories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Categories</Link>
              <Link to="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-pale-green rounded-xl">Analytics</Link>
              <button onClick={handleLogout} className="mt-2 text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl">Sign Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

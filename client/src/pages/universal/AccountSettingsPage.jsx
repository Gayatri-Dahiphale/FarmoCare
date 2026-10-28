import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  Shield,
  KeyRound,
  User,
  Bell,
  CheckCircle2,
  Lock,
  LogOut,
  Smartphone
} from 'lucide-react';

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Notification prefs state
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setUpdating(true);
      await apiClient.put('/auth/password', {
        currentPassword,
        newPassword
      });
      setPasswordMsg('Security credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            Security & Preferences
          </div>
          <h1 className="text-3xl font-extrabold text-forest-green font-serif">
            Account Settings
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your credentials, authentication security, and advisory alerts.
          </p>
        </div>

        {/* User Card */}
        <div className="card-farm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-light-green text-forest-green flex items-center justify-center font-bold text-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block px-2.5 py-0.5 bg-forest-green text-white text-[10px] font-bold uppercase rounded-full mt-1">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Change Password Card */}
        <div className="card-farm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-forest-green font-serif mb-4 pb-2 border-b border-light-green flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-farm-green" />
            Change Password
          </h3>

          {passwordMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-farm-green shrink-0" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-sm">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updating}
                className="btn-primary text-sm px-6 py-2"
              >
                {updating ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="card-farm p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-forest-green font-serif pb-2 border-b border-light-green flex items-center gap-2">
            <Bell className="w-5 h-5 text-farm-green" />
            Advisory & SMS Preferences
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-farm-green" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">SMS Alerts</p>
                  <p className="text-xs text-slate-500">Receive SMS notifications whenever an agronomist prescribes advice.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-farm-green rounded focus:ring-farm-green"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-farm-green" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Email Diagnostic Summary</p>
                  <p className="text-xs text-slate-500">Email copy of clinical reports and chemical dosages.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-farm-green rounded focus:ring-farm-green"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

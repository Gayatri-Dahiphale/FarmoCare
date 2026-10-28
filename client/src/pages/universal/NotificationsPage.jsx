import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Trash2,
  MailOpen
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : (res.notifications || []));
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              Real-time In-App Dispatch
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Notifications & Alerts
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Alerts for expert assignments, treatment prescriptions, and status transitions.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-xs"
            >
              <MailOpen className="w-4 h-4 text-leaf-green" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notification Stream */}
        <div className="card-farm p-6 sm:p-8">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No Notifications</h3>
              <p className="text-xs text-slate-500 mt-1">You are completely up to date.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`py-4 flex items-start justify-between gap-4 transition-colors ${
                    !notif.isRead ? 'bg-light-green/20 -mx-4 px-4 rounded-xl' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-light-green text-forest-green flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      🌾
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>

                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-farm-green hover:text-forest-green shrink-0 mt-1"
                    >
                      View Case <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

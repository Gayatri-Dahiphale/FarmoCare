import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bell, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NotificationDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-pale-green/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/notifications"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-forest-green"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notifications
        </Link>

        <div className="card-farm p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-light-green rounded-2xl flex items-center justify-center text-forest-green mx-auto">
            <Bell className="w-7 h-7 text-farm-green" />
          </div>

          <h1 className="text-2xl font-bold font-serif text-forest-green">
            Notification Notice
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            You received an automated update regarding your agricultural problem case. Follow the link below to inspect your diagnostic timeline.
          </p>

          <div className="pt-4">
            <Link to="/farmer/reports" className="btn-primary inline-flex items-center gap-2">
              <span>View Case Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

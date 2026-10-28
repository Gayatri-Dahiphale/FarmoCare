import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccessDeniedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full card-farm p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">403 Restricted Access</span>
          <h1 className="text-2xl font-extrabold text-forest">Permission Denied</h1>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Your current account credentials ({user?.role || 'Guest'}) do not have authorization to view this administrative or specialist dossier.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/" className="btn-secondary w-full">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

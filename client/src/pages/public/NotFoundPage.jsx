import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full card-farm p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sprout flex items-center justify-center text-farm mx-auto">
          <Sprout className="w-8 h-8 text-farm" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">404 Error</span>
          <h1 className="text-2xl font-extrabold text-forest">Plot Not Found</h1>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            The page or report record you are searching for does not exist or has been relocated to another sector.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

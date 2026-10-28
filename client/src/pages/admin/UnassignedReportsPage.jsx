import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertCircle,
  Clock,
  UserCheck,
  MapPin,
  RefreshCw,
  Sprout,
  ArrowRight
} from 'lucide-react';

export default function UnassignedReportsPage() {
  const { t, getCropName, getCategoryName } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnassigned();
  }, []);

  const fetchUnassigned = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/unassigned').catch(() => apiClient.get('/admin/problems?status=SUBMITTED'));
      const list = res.data?.data || res.data?.problems || (Array.isArray(res.data) ? res.data : []);
      const unassigned = list.filter((p) => (!p.assignedExpertId && !p.assignedTo) || p.status === 'SUBMITTED');
      setReports(unassigned);
    } catch (err) {
      console.error('Failed to load unassigned queue:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <AlertCircle className="w-4 h-4" />
              SLA Priority Dispatch Queue
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Unassigned Problem Reports
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Cases awaiting agronomist review. Rapid assignment ensures farmers receive diagnosis within SLA window.
            </p>
          </div>

          <button
            onClick={fetchUnassigned}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>

        {/* Unassigned Cards Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="card-farm p-16 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-farm-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Triage Queue is Clear!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              All reported agricultural problems currently have an assigned agronomist investigating symptoms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="card-farm p-6 flex flex-col justify-between border-l-4 border-l-amber-500 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-forest-green bg-light-green px-2.5 py-1 rounded-full">
                      {report.reportNumber}
                    </span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{report.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-forest-green">{getCropName(report.cropId) || report.cropId?.name || 'Crop'}</span>
                    <span>•</span>
                    <span>{getCategoryName(report.categoryId) || report.categoryId?.name}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-4">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">Farmer:</span>
                      <span>{report.farmerId?.fullName || report.farmerId?.name || 'Farmer'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Location:</span>
                      <span>{report.location?.village}, {report.location?.district}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <StatusBadge status={report.status} />

                  <Link
                    to={`/admin/assign/${report._id}`}
                    className="btn-primary inline-flex items-center gap-1.5 text-xs px-4 py-2"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Assign Agronomist
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

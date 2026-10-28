import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  Activity,
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SystemActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/problems');
      const problems = res.data.problems || [];

      // Extract status change events and responses across problems
      const events = [];
      problems.forEach((p) => {
        if (p.createdAt) {
          events.push({
            type: 'REPORT_SUBMITTED',
            title: `New Report Submitted: ${p.reportNumber}`,
            description: `Farmer ${p.farmerId?.name || 'Farmer'} reported ${p.title} for ${p.cropId?.name || 'Crop'}`,
            timestamp: p.createdAt,
            badge: 'SUBMITTED',
            color: 'text-amber-700 bg-amber-50'
          });
        }
        if (p.assignedTo && p.updatedAt) {
          events.push({
            type: 'EXPERT_ASSIGNED',
            title: `Case Assigned: ${p.reportNumber}`,
            description: `Assigned to Dr. ${p.assignedTo.name} (${p.assignedTo.specialization || 'Agronomist'})`,
            timestamp: p.updatedAt,
            badge: 'ASSIGNMENT',
            color: 'text-forest-green bg-light-green'
          });
        }
        if (p.responses && p.responses.length > 0) {
          p.responses.forEach((resp) => {
            events.push({
              type: 'RESPONSE_SUBMITTED',
              title: `Official Advisory Prescribed: ${p.reportNumber}`,
              description: `Treatment protocol submitted: "${resp.recommendations.substring(0, 80)}..."`,
              timestamp: resp.createdAt || p.updatedAt,
              badge: 'ADVISORY',
              color: 'text-farm-green bg-pale-green'
            });
          });
        }
      });

      // Sort chronological descending
      events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setActivities(events);
    } catch (err) {
      console.error('Failed to load system logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              Platform Event Audit Trail
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              System Audit & Case History
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Immutable chronological record of agricultural problem submissions, assignments, and clinical advisories.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Log
          </button>
        </div>

        {/* Activity Stream */}
        <div className="card-farm p-6 sm:p-8">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No audit log entries recorded yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-light-green ml-4 space-y-8 py-2">
              {activities.map((act, index) => (
                <div key={index} className="relative pl-6 sm:pl-8 group">
                  {/* Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-farm-green shadow-sm"></div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm group-hover:border-farm-green transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{act.title}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(act.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {act.description}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${act.color}`}>
                        {act.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

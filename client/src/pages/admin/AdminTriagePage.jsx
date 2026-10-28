import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  Zap,
  Check,
  UserCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminTriagePage() {
  const { t, getCropName, getCategoryName } = useLanguage();
  const [unassigned, setUnassigned] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTriageData();
  }, []);

  const loadTriageData = async () => {
    try {
      setLoading(true);
      const [casesRes, expRes] = await Promise.all([
        apiClient.get('/admin/unassigned').catch(() => apiClient.get('/admin/problems?status=SUBMITTED')),
        apiClient.get('/admin/experts')
      ]);
      const list = (casesRes.data?.data || casesRes.data?.problems || (Array.isArray(casesRes.data) ? casesRes.data : []))
        .filter((p) => (!p.assignedExpertId && !p.assignedTo) || p.status === 'SUBMITTED');
      setUnassigned(list);
      setExperts(expRes.data?.experts || expRes.data?.data || (Array.isArray(expRes.data) ? expRes.data : []));
      if (list.length > 0) {
        setSelectedCase(list[0]);
      }
    } catch (err) {
      console.error('Failed to load triage queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAssign = async () => {
    if (!selectedCase || !selectedExpert) return;

    try {
      setAssigning(true);
      await apiClient.post('/admin/assign', {
        problemId: selectedCase._id,
        expertId: selectedExpert,
        reason: 'Rapid administrative triage assignment'
      });
      setSuccess(`Assigned ${selectedCase.reportNumber} to Dr. ${experts.find((e) => e._id === selectedExpert)?.name}`);
      setTimeout(() => setSuccess(''), 3000);
      loadTriageData();
    } catch (err) {
      alert(err.response?.data?.message || 'Quick assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              High-Velocity Case Dispatch
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Rapid Administrative Triage
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Streamlined split interface to match incoming unassigned reports with agronomists in seconds.
            </p>
          </div>

          <button
            onClick={loadTriageData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-farm-green shrink-0" />
            <span className="text-sm font-semibold">{success}</span>
          </div>
        )}

        {unassigned.length === 0 ? (
          <div className="card-farm p-16 text-center">
            <CheckCircle2 className="w-12 h-12 text-farm-green mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Triage Queue Empty</h3>
            <p className="text-xs text-slate-500 mt-1">All incoming problem reports have been dispatched to agronomists.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Queue List */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Unassigned Queue ({unassigned.length} pending)
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {unassigned.map((item) => {
                  const isCurrent = selectedCase?._id === item._id;
                  return (
                    <div
                      key={item._id}
                      onClick={() => setSelectedCase(item)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-farm-green bg-white shadow-sm'
                          : 'border-slate-200 bg-white/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-forest-green">
                          {item.reportNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {getCropName(item.cropId) || item.cropId?.name} • {item.location?.district}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Fast Dispatch Console */}
            <div className="lg:col-span-7">
              {selectedCase && (
                <div className="card-farm p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-light-green">
                    <span className="font-mono text-xs font-bold px-3 py-1 bg-light-green text-forest-green rounded-full">
                      {selectedCase.reportNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      Farmer: <span className="font-semibold text-slate-800">{selectedCase.farmerId?.name}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-serif text-forest-green">{selectedCase.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Crop: <span className="font-semibold text-slate-700">{getCropName(selectedCase.cropId) || selectedCase.cropId?.name}</span> | Category: <span className="font-semibold text-slate-700">{getCategoryName(selectedCase.categoryId) || selectedCase.categoryId?.name}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-500 uppercase block mb-1">Reported Symptoms:</span>
                    {selectedCase.description}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                      Select Agronomist to Dispatch:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {experts.map((exp) => (
                        <button
                          key={exp._id}
                          type="button"
                          onClick={() => setSelectedExpert(exp._id)}
                          className={`p-3 text-left rounded-xl border transition-all ${
                            selectedExpert === exp._id
                              ? 'border-farm-green bg-light-green/40 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900">Dr. {exp.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{exp.specialization || 'Agronomist'}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      disabled={assigning || !selectedExpert}
                      onClick={handleQuickAssign}
                      className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      {assigning ? 'Dispatching...' : 'Dispatch Case Immediately'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

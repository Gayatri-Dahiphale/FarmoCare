import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  UserCheck,
  Briefcase,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldAlert,
  MapPin,
  FileText
} from 'lucide-react';

export default function AssignExpertPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, getCropName, getCategoryName } = useLanguage();

  const [problem, setProblem] = useState(null);
  const [experts, setExperts] = useState([]);
  const [selectedExpertId, setSelectedExpertId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCaseAndExperts();
  }, [id]);

  const fetchCaseAndExperts = async () => {
    try {
      setLoading(true);
      const [probRes, expRes] = await Promise.all([
        apiClient.get(`/admin/problems/${id}`).catch(() => apiClient.get(`/problems/${id}`)),
        apiClient.get('/admin/experts')
      ]);
      const pData = probRes.data?.problem || probRes.data?.data?.problem || probRes.data;
      setProblem(pData);
      const expList = expRes.data?.experts || expRes.data?.data || (Array.isArray(expRes.data) ? expRes.data : []);
      setExperts(expList);
      const currentAssigned = pData?.assignedExpertId || pData?.assignedTo;
      if (currentAssigned) {
        setSelectedExpertId(currentAssigned._id || currentAssigned);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load case or experts');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedExpertId) {
      alert('Please select an agriculture expert.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await apiClient.post('/admin/assign', {
        problemId: id,
        expertId: selectedExpertId,
        reason: reason || (problem.assignedTo ? 'Case re-assigned to alternate specialist' : 'Initial agronomist assignment')
      });

      setSuccessMsg('Case assigned successfully! Updating records...');
      setTimeout(() => {
        navigate('/admin/unassigned');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign case.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg && !problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <p className="font-semibold text-lg">{errorMsg}</p>
          <Link to="/admin/unassigned" className="mt-4 inline-block btn-primary">
            Return to Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/admin/unassigned"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-forest-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Queue
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold text-slate-500">Current Status:</span>
            <StatusBadge status={problem.status} />
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-farm-green shrink-0" />
            <span className="text-sm font-semibold">{successMsg}</span>
          </div>
        )}

        {/* 2-Pane Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Pane: Problem Dossier */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-farm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 border-b border-light-green mb-4">
                <span className="font-mono text-xs font-bold px-3 py-1 bg-light-green text-forest-green rounded-full">
                  {problem.reportNumber}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(problem.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <h2 className="text-xl font-bold font-serif text-forest-green mb-2">{problem.title}</h2>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3 bg-pale-green/40 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-semibold">CROP:</span>
                  <span className="font-bold text-slate-800">{getCropName(problem.cropId) || 'Crop'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">CATEGORY:</span>
                  <span className="font-bold text-slate-800">{getCategoryName(problem.categoryId)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">FARMER:</span>
                  <span className="font-bold text-slate-800">{problem.farmerId?.fullName || problem.farmerId?.name || 'Farmer'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">LOCATION:</span>
                  <span className="font-bold text-slate-800">{problem.location?.village ? `${problem.location.village}, ` : ''}{problem.location?.district || ''}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 mb-4 leading-relaxed">
                <span className="font-bold uppercase text-slate-500 block mb-1">Symptoms Description:</span>
                {problem.description}
              </div>

              {((problem.imageAttachments && problem.imageAttachments.length > 0) || (problem.images && problem.images.length > 0)) && (
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 block mb-2">Field Photographs:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(problem.imageAttachments || problem.images || []).map((img, idx) => (
                      <a
                        key={idx}
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={img.url}
                          alt="Field sample"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Agronomist Workload Matching Console */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-farm p-6 sm:p-8">
              <h2 className="text-xl font-bold font-serif text-forest-green mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-farm-green" />
                Select Specialist Agronomist
              </h2>
              <p className="text-xs text-slate-600 mb-6">
                Match by crop pathology specialty and current active caseload to balance operational load.
              </p>

              <form onSubmit={handleAssign} className="space-y-4">
                <div className="space-y-3">
                  {experts.map((exp) => {
                    const isSelected = selectedExpertId === exp._id;
                    return (
                      <label
                        key={exp._id}
                        className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-farm-green bg-light-green/30 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="expert"
                              value={exp._id}
                              checked={isSelected}
                              onChange={() => setSelectedExpertId(exp._id)}
                              className="w-4 h-4 text-farm-green focus:ring-farm-green"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">Dr. {exp.name}</p>
                              <p className="text-xs text-slate-600">{exp.specialization || 'Agronomy & Plant Protection'}</p>
                              <p className="text-[11px] text-slate-400">{exp.qualification || 'M.Sc. Agriculture'}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                              Status: Active
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Assignment / Reassignment Reason <span className="text-slate-400 font-normal">(Recorded in permanent audit log)</span>
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Specialty match for viral diseases / Workload rebalancing"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !selectedExpertId}
                    className="btn-primary inline-flex items-center gap-2 text-sm px-8 py-3"
                  >
                    <UserCheck className="w-4 h-4" />
                    {submitting ? 'Confirming Assignment...' : problem.assignedTo ? 'Reassign Expert' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

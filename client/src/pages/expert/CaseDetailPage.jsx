import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  AlertTriangle,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Info,
  HelpCircle,
  Activity,
  FileText
} from 'lucide-react';

export default function CaseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, getCropName, getCategoryName } = useLanguage();

  const [problem, setProblem] = useState(null);
  const [similarCases, setSimilarCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Response Form State
  const [observations, setObservations] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [responseStatus, setResponseStatus] = useState('RESPONSE_PROVIDED');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // Status transition state
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Request Info state
  const [infoRequestText, setInfoRequestText] = useState('');
  const [sendingInfoReq, setSendingInfoReq] = useState(false);

  // Selected similar case preview modal
  const [selectedSimilar, setSelectedSimilar] = useState(null);

  useEffect(() => {
    fetchCaseData();
    fetchSimilarCases();
  }, [id]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.get(`/experts/cases/${id}`);
      const pData = res.problem || res.data?.problem || res.data?.data?.problem || res.data;
      if (!pData || (!pData._id && !pData.title)) {
        throw new Error('Case not found or invalid response format');
      }
      setProblem(pData);
      setNewStatus(pData.status || 'ASSIGNED');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load case detail');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCases = async () => {
    try {
      setLoadingSimilar(true);
      const res = await apiClient.get(`/experts/cases/${id}/similar`);
      setSimilarCases(res.similarCases || res.data?.similarCases || res.data?.candidates || []);
    } catch (err) {
      console.warn('Could not fetch similar cases:', err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!newStatus || newStatus === problem.status) return;

    try {
      setUpdatingStatus(true);
      await apiClient.patch(`/experts/cases/${id}/status`, {
        status: newStatus,
        reason: statusReason || `Status shifted to ${newStatus} by agronomist`
      });
      setSuccessMsg(`Status updated successfully to ${newStatus}`);
      setStatusReason('');
      fetchCaseData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!recommendations.trim()) {
      alert('Please provide management recommendations.');
      return;
    }

    try {
      setSubmittingResponse(true);
      await apiClient.post(`/experts/cases/${id}/respond`, {
        observations,
        recommendations,
        precautions,
        status: responseStatus
      });
      setSuccessMsg('Advisory response submitted successfully to farmer!');
      setObservations('');
      setRecommendations('');
      setPrecautions('');
      fetchCaseData();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleRequestInfo = async (e) => {
    e.preventDefault();
    if (!infoRequestText.trim()) return;

    try {
      setSendingInfoReq(true);
      await apiClient.post(`/experts/cases/${id}/respond`, {
        observations: 'Additional field telemetry or symptoms requested from farmer.',
        recommendations: infoRequestText,
        precautions: 'Hold spray applications until identification is confirmed.',
        status: 'AWAITING_FARMER_INFO'
      });
      setSuccessMsg('Request for additional information sent to farmer.');
      setInfoRequestText('');
      fetchCaseData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request info');
    } finally {
      setSendingInfoReq(false);
    }
  };

  const applySimilarSolution = (simCase) => {
    if (simCase.historicalResponse) {
      setRecommendations(simCase.historicalResponse.recommendations || '');
      setPrecautions(simCase.historicalResponse.precautions || '');
      setObservations(`Adapted from historical case ${simCase.reportNumber}: ${simCase.historicalResponse.observations || ''}`);
    }
    setSelectedSimilar(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <p className="font-semibold text-lg">{error || 'Case not found'}</p>
          <Link to="/expert/cases" className="mt-4 inline-block btn-primary">
            Return to Caseload
          </Link>
        </div>
      </div>
    );
  }

  const responses = problem.responses || [];
  const statusHistory = problem.statusHistory || [];
  const followUps = problem.followUps || [];

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Case Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/expert/cases"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-forest-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assigned Caseload
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

        {/* Top Info Bar */}
        <div className="card-farm p-6 bg-white border border-light-green shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 bg-light-green text-forest-green rounded-full">
                  {problem.reportNumber}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Received {new Date(problem.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-forest-green mt-2">
                {problem.title}
              </h1>
            </div>

            {/* Quick Status Shift Form */}
            <form onSubmit={handleStatusChange} className="flex flex-wrap items-center gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-800"
              >
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="AWAITING_FARMER_INFO">AWAITING FARMER INFO</option>
                <option value="RESPONSE_PROVIDED">RESPONSE PROVIDED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REOPENED">REOPENED</option>
              </select>

              <button
                type="submit"
                disabled={updatingStatus || newStatus === problem.status}
                className="px-4 py-2 bg-forest-green text-white text-xs font-semibold rounded-xl hover:bg-forest-green/90 disabled:opacity-40 transition-colors shadow-sm"
              >
                {updatingStatus ? 'Updating...' : 'Set Status'}
              </button>
            </form>
          </div>
        </div>

        {/* Main Grid: 2 Columns (7 cols left for clinical review, 5 cols right for Similar Cases engine & quick tools) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Case Inspection & Response Composer */}
          <div className="lg:col-span-7 space-y-6">
            {/* Farmer Telemetry Card */}
            <div className="card-farm p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-forest-green mb-4 pb-2 border-b border-light-green flex items-center gap-2">
                <User className="w-4 h-4 text-farm-green" />
                Farmer & Crop Telemetry
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Farmer Name</span>
                  <span className="font-semibold text-slate-900">{problem.farmerId?.fullName || problem.farmerId?.name || 'Farmer'}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Mobile</span>
                  <span className="font-semibold text-slate-900">{problem.farmerId?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Location</span>
                  <span className="font-semibold text-slate-900">
                    {problem.location?.village}, {problem.location?.district}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Affected Crop</span>
                  <span className="font-semibold text-forest-green">{getCropName(problem.cropId) || problem.cropId?.name || 'General Crop'}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Problem Category</span>
                  <span className="font-semibold text-slate-900">{getCategoryName(problem.categoryId) || problem.categoryId?.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Crop Growth Stage</span>
                  <span className="font-semibold text-slate-900">{problem.cropStage || 'Vegetative'}</span>
                </div>
              </div>

              {/* Symptom Description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Detailed Symptoms:</span>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>

              {/* Uploaded High-Res Photos */}
              {((problem.images && problem.images.length > 0) || (problem.imageAttachments && problem.imageAttachments.length > 0)) && (
                <div className="mt-4">
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Field Photographs ({((problem.images && problem.images.length > 0) ? problem.images : problem.imageAttachments).length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {((problem.images && problem.images.length > 0) ? problem.images : problem.imageAttachments).map((img, idx) => {
                      const imgUrl = !img?.url
                        ? ''
                        : img.url.startsWith('http://') || img.url.startsWith('https://') || img.url.startsWith('blob:') || img.url.startsWith('data:')
                        ? img.url
                        : `/uploads/${img.url.replace(/^\/+/, '').replace(/^uploads\/+/, '')}`;
                      return (
                        <a
                          key={idx}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative block aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 hover:shadow-md"
                        >
                          <img
                            src={imgUrl}
                            alt={`Evidence ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1">
                            <ExternalLink className="w-3.5 h-3.5" /> Enlarge
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Official Clinical Response Form (Agronomist Prescription) */}
            <div className="card-farm p-6 sm:p-8 border-2 border-farm-green/30 bg-white">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-light-green">
                <h2 className="text-lg font-bold font-serif text-forest-green flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-farm-green" />
                  Prescribe Treatment & Advisory
                </h2>
                <span className="text-xs px-2.5 py-1 bg-light-green text-forest-green font-semibold rounded-full">
                  Agronomist Form
                </span>
              </div>

              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Pathological Observation & Clinical Diagnosis
                  </label>
                  <textarea
                    rows={2}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="e.g. Symptoms indicate severe Thrips tabaci infestation with early leaf curl virus transmission..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-700">
                      Recommended Treatments & Dosage <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Provide chemical & organic options</span>
                  </div>
                  <textarea
                    rows={4}
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    required
                    placeholder="e.g. 1. Chemical: Spray Fipronil 5% SC @ 2 ml/liter of water.&#10;2. Organic: Spray 5% Neem Seed Kernel Extract (NSKE) at dusk. Repeat after 8 days."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Precautionary Warnings & Application Safety
                  </label>
                  <textarea
                    rows={2}
                    value={precautions}
                    onChange={(e) => setPrecautions(e.target.value)}
                    placeholder="e.g. Avoid spraying in bright sunlight or windy conditions. Wear mask and gloves. Observe 7-day pre-harvest waiting period."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 uppercase">Set Status:</span>
                    <select
                      value={responseStatus}
                      onChange={(e) => setResponseStatus(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="RESPONSE_PROVIDED">RESPONSE PROVIDED</option>
                      <option value="RESOLVED">RESOLVED (Complete)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingResponse}
                    className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
                  >
                    <Send className="w-4 h-4" />
                    {submittingResponse ? 'Submitting Advisory...' : 'Submit Official Advisory'}
                  </button>
                </div>
              </form>
            </div>

            {/* Request More Information Section */}
            <div className="card-farm p-6 bg-amber-50/50 border border-amber-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Request Additional Evidence or Telemetry
              </h3>
              <p className="text-xs text-amber-800 mb-3">
                If the submitted photos are blurry or symptoms are ambiguous, ask the farmer for specific leaf underside photos or soil moisture history.
              </p>
              <form onSubmit={handleRequestInfo} className="space-y-3">
                <textarea
                  rows={2}
                  value={infoRequestText}
                  onChange={(e) => setInfoRequestText(e.target.value)}
                  placeholder="e.g. Please upload a clear close-up photograph of the underside of the curled leaves and specify when the last irrigation occurred."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingInfoReq || !infoRequestText.trim()}
                    className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    {sendingInfoReq ? 'Sending...' : 'Send Request & Set Awaiting Info'}
                  </button>
                </div>
              </form>
            </div>

            {/* Previous Responses & Follow-Up History */}
            {responses.length > 0 && (
              <div className="card-farm p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-forest-green mb-4 pb-2 border-b border-light-green flex items-center gap-2">
                  <FileText className="w-4 h-4 text-leaf-green" />
                  Past Advisory Responses ({responses.length})
                </h3>
                <div className="space-y-4">
                  {responses.map((resp, i) => (
                    <div key={resp._id || i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-forest-green">
                          Dr. {resp.authorId?.fullName || resp.authorId?.name || resp.expertId?.name || 'Expert Specialist'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(resp.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      {resp.observations && (
                        <p className="text-xs text-slate-600 mb-2">
                          <span className="font-semibold text-slate-700">Diagnosis:</span> {resp.observations}
                        </p>
                      )}
                      {(resp.recommendations || resp.message) && (
                        <div className="text-slate-800 text-xs mb-2">
                          <span className="font-semibold text-forest-green block mb-1">Prescription & Advice:</span>
                          {Array.isArray(resp.recommendations) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {resp.recommendations.map((rec, rIdx) => (
                                <li key={rIdx}>{rec}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="whitespace-pre-wrap">{resp.recommendations || resp.message}</p>
                          )}
                        </div>
                      )}
                      {(resp.precautionaryNotes || resp.precautions) && (
                        <p className="text-xs text-amber-800 mt-2 bg-amber-50 p-2 rounded-lg">
                          <span className="font-semibold">Precautions:</span> {resp.precautionaryNotes || resp.precautions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Farmer Follow-Ups Timeline */}
            {followUps.length > 0 && (
              <div className="card-farm p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-forest-green mb-4 pb-2 border-b border-light-green flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-leaf-green" />
                  Farmer Follow-Up Queries ({followUps.length})
                </h3>
                <div className="space-y-3">
                  {followUps.map((f, i) => (
                    <div key={i} className="p-3 bg-pale-green/40 rounded-xl border border-light-green text-sm">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-forest-green">{problem.farmerId?.name || 'Farmer'}</span>
                        <span>{new Date(f.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <p className="text-slate-800">{f.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Similar Solved Problems Engine & Clinical Protocols */}
          <div className="lg:col-span-5 space-y-6">
            {/* Agronomist Specimen Diagnostic Protocol Card */}
            <div className="card-farm p-4 bg-white border border-light-green space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-farm-green/30 bg-sprout">
                  <img
                    src="/images/expert_leaf_inspection.png"
                    alt="Agronomist conducting microscopic examination of diseased leaf specimen"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-farm-green">
                    Advisory Review Standard
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-forest-green">
                    Clinical Specimen Inspection
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Cross-examine farmer photo telemetry against university herbarium benchmarks before approving dosages.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-farm p-6 border-2 border-leaf-green/40 bg-gradient-to-br from-white to-pale-green/30">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-light-green">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-leaf-green text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-forest-green font-serif">
                      Similar Solved Problems
                    </h2>
                    <p className="text-[11px] text-slate-500">Historical database match engine</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 bg-leaf-green/20 text-forest-green font-bold rounded-full">
                  AI-Free Engine
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Ranked by crop match (40%), category match (35%), and symptom keyword similarity (25%). Review past treatments verified in field conditions.
              </p>

              {loadingSimilar ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-3 border-leaf-green border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : similarCases.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No resolved historical cases matched</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    No verified past solutions found with identical crop and category.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {similarCases.map((sim) => (
                    <div
                      key={sim._id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-farm-green transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-forest-green bg-pale-green px-2 py-0.5 rounded">
                          {sim.reportNumber}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-farm-green bg-light-green/70 px-2.5 py-0.5 rounded-full">
                          <span>{sim.score}% Match</span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{sim.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2">{sim.description}</p>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 mb-3">
                        <span className="font-bold text-forest-green block mb-0.5">Verified Solution:</span>
                        <p className="line-clamp-2">{sim.historicalResponse?.recommendations || 'Treatment administered.'}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[11px] text-slate-400">
                          {sim.matchExplanation?.sharedKeywords?.length > 0 &&
                            `Keywords: ${sim.matchExplanation.sharedKeywords.slice(0, 3).join(', ')}`}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedSimilar(sim)}
                            className="text-forest-green hover:underline font-semibold"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => applySimilarSolution(sim)}
                            className="px-2.5 py-1 bg-light-green text-forest-green font-semibold rounded-lg hover:bg-forest-green hover:text-white transition-colors"
                          >
                            Copy to Prescription
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnostic Formulary Quick Reference */}
            <div className="card-farm p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-forest-green mb-3 flex items-center justify-between">
                <span>Quick Diagnostic Reference</span>
                <Link to="/expert/formulary" className="text-xs text-farm-green hover:underline normal-case font-semibold">
                  Full Formulary &rarr;
                </Link>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">Sucking Pests (Thrips, Whitefly):</span>
                  <p className="text-slate-600 mt-0.5">Imidacloprid 17.8 SL @ 0.3ml/L OR Acetamiprid 20 SP @ 0.2g/L</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">Fungal Leaf Spot / Blight:</span>
                  <p className="text-slate-600 mt-0.5">Mancozeb 75 WP @ 2.5g/L OR Azoxystrobin + Difenoconazole @ 1ml/L</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">Bacterial Leaf Blight:</span>
                  <p className="text-slate-600 mt-0.5">Copper Oxychloride 50 WP @ 2.5g/L + Streptocycline @ 0.1g/L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Case Modal */}
      {selectedSimilar && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 bg-light-green text-forest-green rounded-full">
                  {selectedSimilar.reportNumber}
                </span>
                <span className="text-sm font-bold text-farm-green">{selectedSimilar.score}% Match Score</span>
              </div>
              <button
                onClick={() => setSelectedSimilar(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedSimilar.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Crop: {selectedSimilar.cropId?.name} | Category: {selectedSimilar.categoryId?.name}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Problem Description:</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedSimilar.description}</p>
              </div>

              {selectedSimilar.historicalResponse && (
                <div className="p-4 bg-light-green/30 rounded-xl border border-light-green">
                  <span className="text-xs font-bold uppercase text-forest-green block mb-1">
                    Historical Treatment Prescribed:
                  </span>
                  <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedSimilar.historicalResponse.recommendations}
                  </p>
                  {selectedSimilar.historicalResponse.precautions && (
                    <p className="text-xs text-amber-900 mt-2">
                      <span className="font-semibold">Precautions:</span> {selectedSimilar.historicalResponse.precautions}
                    </p>
                  )}
                </div>
              )}

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                <span className="font-bold block mb-1">Similarity Breakdown:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>Crop match: 40%</li>
                  <li>Category match: 35%</li>
                  <li>Description keyword overlap: {Math.max(0, selectedSimilar.score - 75)}%</li>
                  {selectedSimilar.matchExplanation?.sharedKeywords && (
                    <li>Common terms: {selectedSimilar.matchExplanation.sharedKeywords.join(', ')}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSimilar(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => applySimilarSolution(selectedSimilar)}
                className="btn-primary text-sm px-5 py-2"
              >
                Use this Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

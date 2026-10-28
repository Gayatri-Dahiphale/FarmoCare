import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/StatusBadge';
import { getCropImageUrl } from '../../constants/predefinedOptions';
import {
  FileText,
  MapPin,
  Calendar,
  Layers,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  ChevronLeft,
  User,
  ShieldCheck,
  Camera,
  AlertTriangle,
} from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, getCropName, getCategoryName } = useLanguage();

  const [problem, setProblem] = useState(null);
  const [responses, setResponses] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Follow-up state
  const [followUpMsg, setFollowUpMsg] = useState('');
  const [issuePersists, setIssuePersists] = useState(true);
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);
  const [followUpError, setFollowUpError] = useState(null);

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      const [probRes, respRes, histRes] = await Promise.all([
        apiClient.get(`/problems/${id}`),
        apiClient.get(`/problems/${id}/responses`).catch(() => ({ data: [] })),
        apiClient.get(`/problems/${id}/status-history`).catch(() => ({ data: [] })),
      ]);

      const pData = probRes.problem || probRes.data?.problem || probRes.data;
      if (pData) setProblem(pData);

      const rList = Array.isArray(respRes.responses)
        ? respRes.responses
        : Array.isArray(respRes.data)
        ? respRes.data
        : Array.isArray(respRes.data?.data)
        ? respRes.data.data
        : Array.isArray(pData?.responses)
        ? pData.responses
        : Array.isArray(probRes.responses)
        ? probRes.responses
        : [];
      setResponses(rList);

      const hList = Array.isArray(histRes.statusHistory)
        ? histRes.statusHistory
        : Array.isArray(histRes.data)
        ? histRes.data
        : Array.isArray(histRes.data?.data)
        ? histRes.data.data
        : Array.isArray(pData?.statusHistory)
        ? pData.statusHistory
        : Array.isArray(probRes.statusHistory)
        ? probRes.statusHistory
        : [];
      setStatusHistory(hList);
    } catch (err) {
      setError(err.message || 'Could not load report details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!followUpMsg.trim()) return;

    setSubmittingFollowUp(true);
    setFollowUpError(null);
    try {
      const res = await apiClient(`/problems/${id}/follow-ups`, {
        method: 'POST',
        body: JSON.stringify({
          message: followUpMsg.trim(),
          issuePersists,
        }),
      });

      if (res.success) {
        setFollowUpMsg('');
        fetchCaseDetails();
      }
    } catch (err) {
      setFollowUpError(err.message || 'Failed to submit follow-up.');
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-charcoal-muted">
        <div className="w-10 h-10 border-4 border-farm border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium">Loading report dossier and expert responses...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm">
          {error || 'Problem report not found.'}
        </div>
        <Link to="/farmer/reports" className="btn-secondary">
          <ChevronLeft className="w-4 h-4" /> Back to My Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-border pb-4">
        <div className="space-y-1">
          <Link
            to={user?.role === 'farmer' ? '/farmer/reports' : '/expert/cases'}
            className="text-xs font-semibold text-farm hover:underline inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Case Queue
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-forest">{problem.title}</h1>
            <StatusBadge status={problem.status} size="lg" />
          </div>
          <div className="text-xs text-charcoal-muted flex items-center gap-3 flex-wrap">
            <span className="font-mono font-bold text-forest bg-sprout px-2 py-0.5 rounded">
              {problem.reportNumber}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {getCropImageUrl(problem.cropId) && (
                <img
                  src={getCropImageUrl(problem.cropId)}
                  alt={problem.cropId?.name || 'Crop'}
                  className="w-5 h-5 rounded object-cover border border-farm/30"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <span>{t('crop', 'Crop')}: <strong>{getCropName(problem.cropId)}</strong></span>
            </span>
            <span>{t('category', 'Category')}: <strong>{getCategoryName(problem.categoryId) || problem.categoryId?.name}</strong></span>
            <span>{t('reportedOn', 'Reported on')}: {new Date(problem.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <Link
          to={`/reports/${problem._id}/advisory`}
          target="_blank"
          className="btn-secondary self-start sm:self-center text-xs py-2 px-3"
        >
          <Printer className="w-4 h-4 mr-1" />
          {t('downloadPdf', 'Print Advisory PDF')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Report Details & Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Problem Overview Card */}
          <div className="card-farm p-6 space-y-5">
            <h2 className="text-base font-bold text-forest border-b border-charcoal-border pb-2">
              {t('observations', 'Field Observations & Parameters')}
            </h2>

            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-sprout/30 text-xs">
              <div>
                <span className="text-charcoal-muted block">{t('location', 'Location')}:</span>
                <span className="font-semibold text-forest">
                  {problem.location?.village ? `${problem.location.village}, ` : ''}{problem.location?.district}
                </span>
              </div>
              <div>
                <span className="text-charcoal-muted block">{t('affectedAreaLabel', 'Affected Area')}:</span>
                <span className="font-semibold text-forest">{problem.affectedArea || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">{t('cropStageLabel', 'Growth Stage')}:</span>
                <span className="font-semibold text-forest">{problem.growthStage || 'Not specified'}</span>
              </div>
            </div>

            {/* Evidence Photographs */}
            {problem.imageAttachments && problem.imageAttachments.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal block">
                  Field Photographs ({problem.imageAttachments.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {problem.imageAttachments.map((img, i) => (
                    <a
                      key={i}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-lg overflow-hidden border border-charcoal-border relative h-36 block bg-black/5"
                    >
                      <img
                        src={img.url}
                        alt={`Attachment ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Expert Recommendations & Responses */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-forest">{t('clinicalAdvisory', 'Agronomist Advisory & Dialogue')}</h2>

            {responses.length === 0 ? (
              <div className="card-farm p-8 text-center space-y-2">
                <Clock className="w-8 h-8 text-charcoal-muted mx-auto" />
                <h4 className="font-bold text-forest text-sm">{t('noAdvisoryYet', 'Awaiting Expert Evaluation')}</h4>
                <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                  Your case has been logged. The assigned specialist will review the symptoms and formulate treatment guidance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((resp) => {
                  const isExpert = ['EXPERT_RECOMMENDATION', 'INFORMATION_REQUEST'].includes(resp.responseType);
                  return (
                    <div
                      key={resp._id}
                      className={`card-farm p-6 space-y-3 ${
                        isExpert ? 'border-farm/40 bg-white' : 'border-blue-200 bg-blue-50/20'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-charcoal-border/50 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isExpert ? 'bg-farm text-white' : 'bg-blue-600 text-white'
                            }`}
                          >
                            {isExpert ? 'Dr' : 'F'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-forest block">
                              {resp.authorId?.fullName || 'Specialist'}
                            </span>
                            <span className="text-[10px] text-charcoal-muted">
                              {resp.authorId?.designation || (isExpert ? 'Agricultural Specialist' : 'Farmer')}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-charcoal-muted">
                          {new Date(resp.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Observations */}
                      {resp.observations && (
                        <div className="p-3 rounded-lg bg-sprout/40 text-xs space-y-1">
                          <span className="font-bold text-forest block">Clinical Observations:</span>
                          <p className="text-charcoal leading-relaxed">{resp.observations}</p>
                        </div>
                      )}

                      {/* Main Message */}
                      <p className="text-sm text-charcoal leading-relaxed">{resp.message}</p>

                      {/* Recommendations Bullet Points */}
                      {((Array.isArray(resp.recommendations) && resp.recommendations.length > 0) ||
                        (typeof resp.recommendations === 'string' && resp.recommendations.trim())) && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold text-forest block">
                            {t('treatmentPlan', 'Recommended Interventions:')}
                          </span>
                          {Array.isArray(resp.recommendations) ? (
                            <ul className="space-y-1 text-xs text-charcoal">
                              {resp.recommendations.map((rec, rIdx) => (
                                <li key={rIdx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-farm shrink-0 mt-0.5" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-charcoal whitespace-pre-wrap">{resp.recommendations}</p>
                          )}
                        </div>
                      )}

                      {/* Precautionary Notes */}
                      {(resp.precautionaryNotes || resp.precautions) && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">{t('precautions', 'Safety & Precaution:')}</span>
                            <span>{resp.precautionaryNotes || resp.precautions}</span>
                          </div>
                        </div>
                      )}

                      {/* Requested Information Alert */}
                      {resp.requestedInformation && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                          <span className="font-bold block text-rose-700">Information Needed from Farmer:</span>
                          <p>{resp.requestedInformation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Farmer Follow-up Form */}
          {user?.role === 'farmer' && (
            <div className="card-farm p-6 space-y-4 bg-sprout/20 border-farm/30">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-forest">{t('followUpTitle', 'Send Follow-Up / Report Progress')}</h3>
                <p className="text-xs text-charcoal-muted">
                  Share treatment results, answer agronomist requests, or confirm symptom status.
                </p>
              </div>

              {followUpError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {followUpError}
                </div>
              )}

              <form onSubmit={handleFollowUpSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder={t('followUpPlaceholder', 'e.g. Applied Acetamiprid spray 3 days ago. Yellow spots have stopped spreading...')}
                  value={followUpMsg}
                  onChange={(e) => setFollowUpMsg(e.target.value)}
                  className="input-farm"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-semibold text-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={issuePersists}
                      onChange={(e) => setIssuePersists(e.target.checked)}
                      className="rounded text-farm focus:ring-farm w-4 h-4"
                    />
                    <span>{t('issuePersistsYes', 'Crop symptoms still persist')}</span>
                  </label>

                  <button
                    type="submit"
                    disabled={submittingFollowUp}
                    className="btn-primary text-xs py-2 px-5 shadow-xs"
                  >
                    {submittingFollowUp ? t('updating', 'Submitting...') : t('sendFollowUpBtn', 'Send Message')}
                    <Send className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Specialist Profile & Case Timeline (1 col) */}
        <div className="space-y-6">
          {/* Assigned Specialist Card */}
          <div className="card-farm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              {t('assignedExpert', 'Assigned Agronomist')}
            </h3>

            {problem.assignedExpertId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center text-sm">
                    {problem.assignedExpertId.fullName?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm">
                      {problem.assignedExpertId.fullName}
                    </h4>
                    <span className="text-xs text-charcoal-muted block">
                      {problem.assignedExpertId.designation || 'Agricultural Specialist'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-charcoal space-y-1 pt-2 border-t border-charcoal-border">
                  <div className="text-charcoal-muted">{problem.assignedExpertId.institution}</div>
                  <div className="flex items-center gap-1.5 text-farm font-semibold pt-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ICAR Verified Agronomist</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                Awaiting expert assignment from central triage queue.
              </div>
            )}
          </div>

          {/* Audit Timeline */}
          <div className="card-farm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              {t('caseTimeline', 'Status Lifecycle Timeline')}
            </h3>

            {statusHistory.length === 0 ? (
              <div className="text-xs text-charcoal-muted">No status changes recorded yet.</div>
            ) : (
              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sprout-dark">
                {statusHistory.map((item, idx) => (
                  <div key={idx} className="relative text-xs space-y-0.5">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-farm border-2 border-white ring-2 ring-sprout" />
                    <div className="font-bold text-forest flex items-center gap-2">
                      <StatusBadge status={item.newStatus} />
                    </div>
                    {item.reason && (
                      <p className="text-charcoal-muted text-[11px] leading-relaxed pt-0.5">
                        {item.reason}
                      </p>
                    )}
                    <span className="text-[10px] text-charcoal-muted block">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

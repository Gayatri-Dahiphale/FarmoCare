import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Search,
  BookOpen,
  Filter,
  Eye
} from 'lucide-react';

export default function ExpertDashboardPage() {
  const { user } = useAuth();
  const { t, getCropName, getCategoryName } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    underReview: 0,
    awaitingInfo: 0,
    resolved: 0,
    total: 0
  });
  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/experts/cases?limit=100');
      const caseList =
        res.problems ||
        res.data?.problems ||
        (Array.isArray(res.data?.data) ? res.data.data : null) ||
        (Array.isArray(res.data) ? res.data : []);
      setCases(caseList);

      const assigned = caseList.filter(c => c.status === 'ASSIGNED').length;
      const underReview = caseList.filter(c => c.status === 'UNDER_REVIEW').length;
      const awaitingInfo = caseList.filter(
        c => c.status === 'AWAITING_FARMER_INFORMATION' || c.status === 'AWAITING_FARMER_INFO'
      ).length;
      const resolved = caseList.filter(c => c.status === 'RESOLVED').length;

      setStats({
        assigned,
        underReview,
        awaitingInfo,
        resolved,
        total: caseList.length
      });
    } catch (err) {
      console.error('Failed to load expert caseload:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const farmerName = c.farmerId?.fullName || c.farmerId?.name || '';
    const cropName = getCropName(c.cropId) || c.cropId?.name || '';
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (c.title || '').toLowerCase().includes(q) ||
      (c.reportNumber || '').toLowerCase().includes(q) ||
      cropName.toLowerCase().includes(q) ||
      farmerName.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q);
    const matchesStatus =
      !statusFilter ||
      c.status === statusFilter ||
      (statusFilter === 'AWAITING_FARMER_INFO' &&
        (c.status === 'AWAITING_FARMER_INFORMATION' || c.status === 'AWAITING_FARMER_INFO'));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-farm-green uppercase tracking-wider mb-1.5">
              <Briefcase className="w-4.5 h-4.5" />
              {t('agronomistClinicalStation', 'Agronomist Clinical Station')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-green font-serif tracking-tight">
              {t('welcomeDoctor', 'Welcome, Dr.')} {user?.name || user?.fullName || 'Expert'}
            </h1>
            <p className="text-slate-600 mt-1.5 text-base">
              {t('activeCaseload', 'Active Caseload')}: <span className="font-semibold text-slate-800">{stats.total}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/expert/cases"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              {t('assignedCases', 'All Assigned Cases')}
            </Link>
            <Link
              to="/expert/formulary"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 font-semibold rounded-xl text-forest-green hover:bg-slate-50 transition-colors shadow-sm text-sm"
            >
              <BookOpen className="w-4 h-4 text-leaf-green" />
              {t('formulary', 'Dosage Formulary')}
            </Link>
          </div>
        </div>

        {/* Diagnostic KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-farm p-6 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">{t('ASSIGNED', 'New Assigned')}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.assigned}</p>
              <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {t('actionNeeded', 'Requires triage')}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="card-farm p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">{t('UNDER_REVIEW', 'Under Review')}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.underReview}</p>
              <p className="text-xs text-blue-700 mt-1">{t('underReview', 'In active pathology diagnosis')}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="card-farm p-6 border-l-4 border-l-purple-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">{t('AWAITING_FARMER_INFO', 'Awaiting Info')}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.awaitingInfo}</p>
              <p className="text-xs text-purple-700 mt-1">{t('actionNeeded', 'Farmer query pending')}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="card-farm p-6 border-l-4 border-l-leaf-green flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">{t('RESOLVED', 'Resolved Cases')}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.resolved}</p>
              <p className="text-xs text-leaf-green mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('resolvedCases', 'Treatment verified')}
              </p>
            </div>
            <div className="w-12 h-12 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold">
              <CheckCircle2 className="w-6 h-6 text-farm-green" />
            </div>
          </div>
        </div>

        {/* Caseload Triage Queue */}
        <div className="card-farm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-forest-green font-serif">
                {t('assignedCases', 'Clinical Priority Caseload')}
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by arrival priority. Review symptoms, examine photographic evidence, and consult historical matches.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('search', 'Search case, crop, symptom...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">{t('allStatuses', 'All Statuses')}</option>
                <option value="ASSIGNED">{t('SUBMITTED', 'New Assigned')}</option>
                <option value="UNDER_REVIEW">{t('UNDER_REVIEW', 'Under Review')}</option>
                <option value="AWAITING_FARMER_INFO">{t('AWAITING_FARMER_INFO', 'Awaiting Info')}</option>
                <option value="RESPONSE_PROVIDED">{t('RESPONSE_PROVIDED', 'Response Provided')}</option>
                <option value="RESOLVED">{t('RESOLVED', 'Resolved')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No matching cases in your triage queue</h3>
              <p className="text-xs text-slate-500 mt-1">All assigned agricultural reports have been processed or none match your filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Case #</th>
                    <th className="py-3 px-4">{t('crop', 'Crop')} & {t('category', 'Category')}</th>
                    <th className="py-3 px-4">{t('farmers', 'Farmer')} & {t('location', 'Location')}</th>
                    <th className="py-3 px-4">Problem Summary</th>
                    <th className="py-3 px-4">{t('status', 'Status')}</th>
                    <th className="py-3 px-4 text-right">{t('actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.slice(0, 10).map((c) => (
                    <tr key={c._id} className="hover:bg-pale-green/30 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-forest-green text-xs">
                        {c.reportNumber}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{getCropName(c.cropId) || c.cropId?.name || 'General Crop'}</div>
                        <div className="text-xs text-slate-500">{getCategoryName(c.categoryId) || c.categoryId?.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{c.farmerId?.fullName || c.farmerId?.name || 'Farmer'}</div>
                        <div className="text-xs text-slate-500">{c.location?.village}, {c.location?.district}</div>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="truncate font-medium text-slate-800">{c.title}</p>
                        <p className="text-xs text-slate-500 truncate">{c.description}</p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/expert/cases/${c._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-green text-white rounded-lg text-xs font-semibold hover:bg-forest-green/90 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Diagnose
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

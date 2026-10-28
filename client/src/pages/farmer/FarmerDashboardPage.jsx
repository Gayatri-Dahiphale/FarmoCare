import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import {
  PlusCircle,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  CloudSun,
  Sprout,
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const { t, getCropName, getCategoryName } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    awaitingInfo: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const fetchFarmerData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/problems/my?limit=5');
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : (res.problems || []));
      setReports(list);

      const allRes = await apiClient.get('/problems/my?limit=100');
      const allList = Array.isArray(allRes.data) ? allRes.data : (Array.isArray(allRes.data?.data) ? allRes.data.data : (allRes.problems || []));
      const total = allRes.pagination?.totalItems || allRes.data?.pagination?.totalItems || allList.length;

      setStats({
        total,
        underReview: allList.filter((r) => ['UNDER_REVIEW', 'ASSIGNED'].includes(r.status)).length,
        awaitingInfo: allList.filter((r) => ['AWAITING_FARMER_INFO', 'AWAITING_FARMER_INFORMATION'].includes(r.status)).length,
        resolved: allList.filter((r) => r.status === 'RESOLVED').length,
      });
    } catch (err) {
      console.error('Error fetching farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Weather Widget Banner */}
      <div className="card-farm p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 min-h-[180px]">
        {/* Real Agricultural Background Image with Forest Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/farmer_dashboard_banner.png"
            alt="Farmer in lush agricultural field at sunrise"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest/85 to-forest/50" />
        </div>

        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sage-light">
            {t('appName')} • {t('dashboard')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('welcomeFarmer')} ({user?.fullName || 'Farmer'})
          </h1>
          <p className="text-sm text-sage-light/90 max-w-lg">
            {t('farmerDashboardSubtitle')}
          </p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <Link
            to="/farmer/new-report"
            className="btn-primary bg-leaf hover:bg-leaf-dark text-white font-bold py-3 px-6 shadow-md"
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            {t('reportProblem')}
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-farm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-charcoal-muted">{t('totalReports')}</span>
            <FileText className="w-4 h-4 text-forest" />
          </div>
          <div className="text-3xl font-extrabold text-forest">{stats.total}</div>
          <div className="text-xs text-charcoal-muted">All submitted field cases</div>
        </div>

        <div className="card-farm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-charcoal-muted">{t('underReview')}</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-700">{stats.underReview}</div>
          <div className="text-xs text-charcoal-muted">Being examined by experts</div>
        </div>

        <div className="card-farm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-charcoal-muted">{t('actionNeeded')}</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600">{stats.awaitingInfo}</div>
          <div className="text-xs text-charcoal-muted">Expert requested info</div>
        </div>

        <div className="card-farm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-charcoal-muted">{t('resolvedCases')}</span>
            <CheckCircle2 className="w-4 h-4 text-farm" />
          </div>
          <div className="text-3xl font-extrabold text-farm">{stats.resolved}</div>
          <div className="text-xs text-charcoal-muted">Advisory delivered</div>
        </div>
      </div>

      {/* Predefined Crop Advisory Guide (8 Predefined Crops) */}
      <div className="card-farm p-6 space-y-4 bg-white border border-charcoal-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-forest flex items-center gap-2">
              <Sprout className="w-5 h-5 text-farm" />
              Regional Crop Health Guide
            </h2>
            <p className="text-xs text-charcoal-muted">
              Select your crop to view diagnostic benchmarks or submit a quick report
            </p>
          </div>
          <Link
            to="/farmer/new-report"
            className="text-xs font-bold text-farm hover:text-forest flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Report specific symptom</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { name: 'Wheat', mr: 'गहू', season: 'Rabi', image: '/images/crop_wheat.png' },
            { name: 'Rice', mr: 'भात', season: 'Kharif', image: '/images/crop_rice.png' },
            { name: 'Cotton', mr: 'कपाशी', season: 'Kharif', image: '/images/crop_cotton.png' },
            { name: 'Soybean', mr: 'सोयाबीन', season: 'Kharif', image: '/images/crop_soybean.png' },
            { name: 'Sugarcane', mr: 'ऊस', season: 'Annual', image: '/images/crop_sugarcane.png' },
            { name: 'Tomato', mr: 'टोमॅटो', season: 'All-Year', image: '/images/crop_tomato.png' },
            { name: 'Onion', mr: 'कांदा', season: 'Rabi/Kharif', image: '/images/crop_onion.png' },
            { name: 'Maize', mr: 'मका', season: 'Kharif', image: '/images/crop_maize.png' },
          ].map((crop, idx) => (
            <Link
              key={idx}
              to="/farmer/new-report"
              className="group p-2.5 rounded-xl border border-charcoal-border/70 hover:border-farm bg-white hover:bg-sprout/20 transition-all flex flex-col items-center text-center space-y-2"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-sprout border border-leaf/20 shadow-2xs">
                <img
                  src={crop.image}
                  alt={`${crop.name} crop field guide`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0 w-full">
                <div className="text-xs font-bold text-forest truncate group-hover:text-farm">
                  {crop.name}
                </div>
                <div className="text-[10px] text-charcoal-muted truncate font-medium">
                  {crop.mr} • {crop.season}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="card-farm overflow-hidden">
        <div className="p-6 border-b border-charcoal-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-forest">{t('recentReports')}</h2>
            <p className="text-xs text-charcoal-muted">Latest diagnostic cases submitted from your farm</p>
          </div>
          <Link
            to="/farmer/reports"
            className="text-xs font-bold text-farm hover:underline flex items-center gap-1"
          >
            {t('myReports')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-charcoal-muted text-sm">
            <div className="w-8 h-8 border-3 border-farm border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            {t('loading')}
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-sprout flex items-center justify-center text-farm mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-forest text-base">{t('noReportsYet')}</h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                {t('getAdviceFast')}
              </p>
            </div>
            <Link to="/farmer/new-report" className="btn-primary text-xs py-2 px-4">
              {t('reportProblem')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-border">
            {reports.map((report) => (
              <Link
                key={report._id}
                to={`/reports/${report._id}`}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-sprout/20 transition-colors block"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-forest bg-sprout px-2 py-0.5 rounded">
                      {report.reportNumber}
                    </span>
                    <StatusBadge status={report.status} />
                    <span className="text-xs font-medium text-charcoal-muted">
                      {getCropName(report.cropId) || report.cropId?.name || 'General Crop'}
                    </span>
                    <span className="text-xs text-charcoal-muted">•</span>
                    <span className="text-xs text-charcoal-muted">
                      {getCategoryName(report.categoryId) || report.categoryId?.name || 'General Issue'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-charcoal truncate">{report.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-charcoal-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {report.location?.village ? `${report.location.village}, ` : ''}{report.location?.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.submittedAt).toLocaleDateString()}
                    </span>
                    {report.assignedExpertId && (
                      <span className="text-farm font-medium">
                        Assigned: {report.assignedExpertId.fullName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="btn-secondary text-xs py-1.5 px-3">
                    View Case <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { getCropImageUrl } from '../../constants/predefinedOptions';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Calendar,
  MapPin,
  ChevronRight,
  User,
} from 'lucide-react';

export default function FarmerReportsPage() {
  const { t, getCropName, getCategoryName } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [statusFilter, selectedCrop]);

  const fetchCrops = async () => {
    try {
      const res = await apiClient.get('/crops');
      const list = res.crops || res.data?.crops || (Array.isArray(res.data) ? res.data : []);
      setCrops(list);
    } catch (err) {}
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = `/problems/my?limit=50`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (selectedCrop) url += `&cropId=${selectedCrop}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await apiClient.get(url);
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : (res.problems || []));
      setReports(list);
    } catch (err) {
      console.error('Error fetching farmer reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-farm px-3 py-1 rounded-full bg-sprout">
            {t('appName')} • {t('myReports')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest mt-1">
            {t('myReports')}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Track case progress, specialist diagnosis, and advisory timelines.
          </p>
        </div>
        <Link to="/farmer/new-report" className="btn-primary self-start sm:self-center">
          <PlusCircle className="w-4 h-4 mr-1" />
          {t('reportProblem')}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-farm p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-farm pl-10"
            />
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="input-farm w-auto min-w-[140px]"
            >
              <option value="">{t('allCrops')}</option>
              {crops.map((c) => (
                <option key={c._id} value={c._id}>
                  {getCropName(c)}
                </option>
              ))}
            </select>

            <button type="submit" className="btn-secondary">
              {t('filter')}
            </button>
          </div>
        </form>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { label: t('allStatuses'), value: '' },
            { label: t('SUBMITTED'), value: 'SUBMITTED' },
            { label: t('ASSIGNED'), value: 'ASSIGNED' },
            { label: t('UNDER_REVIEW'), value: 'UNDER_REVIEW' },
            { label: t('AWAITING_FARMER_INFORMATION'), value: 'AWAITING_FARMER_INFORMATION' },
            { label: t('RESPONSE_PROVIDED'), value: 'RESPONSE_PROVIDED' },
            { label: t('RESOLVED'), value: 'RESOLVED' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                statusFilter === pill.value
                  ? 'bg-forest text-white'
                  : 'bg-white border border-charcoal-border text-charcoal hover:bg-sprout'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="card-farm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-charcoal-muted text-sm">
            <div className="w-8 h-8 border-3 border-farm border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading report records...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-sprout flex items-center justify-center text-farm mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-forest text-base">No Matching Reports Found</h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                No problem reports match your current filters. Adjust your search criteria or submit a new report.
              </p>
            </div>
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
                    <span className="text-xs font-semibold text-charcoal inline-flex items-center gap-1.5">
                      {getCropImageUrl(report.cropId) && (
                        <img
                          src={getCropImageUrl(report.cropId)}
                          alt=""
                          className="w-4 h-4 rounded object-cover border border-farm/20"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span>{getCropName(report.cropId) || report.cropId?.name || 'Crop'}</span>
                    </span>
                    <span className="text-xs text-charcoal-muted">•</span>
                    <span className="text-xs text-charcoal-muted">
                      {getCategoryName(report.categoryId) || report.categoryId?.name}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-charcoal truncate">{report.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-charcoal-muted flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {report.location?.village ? `${report.location.village}, ` : ''}{report.location?.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.submittedAt).toLocaleDateString()}
                    </span>
                    {report.assignedExpertId && (
                      <span className="text-farm font-medium flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {report.assignedExpertId.fullName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="btn-secondary text-xs py-1.5 px-3">
                    View Advisory <ChevronRight className="w-3.5 h-3.5" />
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

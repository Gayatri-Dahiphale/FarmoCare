import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Users,
  Shield,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  UserCheck,
  Sprout,
  Layers,
  Activity,
  Plus
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function AdminDashboardPage() {
  const { t, getCropName } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    counters: {
      totalUsers: 0,
      totalFarmers: 0,
      totalExperts: 0,
      totalProblems: 0,
      unassignedProblems: 0,
      underReviewProblems: 0,
      awaitingInfoProblems: 0,
      resolvedProblems: 0,
      reopenedProblems: 0
    },
    byCategory: [],
    byCrop: [],
    byStatus: [],
    expertWorkload: [],
    recentProblems: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/dashboard');
      const payload = res.data?.data || res.data || {};

      const counters = payload.counters || payload.summary || {
        totalFarmers: 0,
        totalExperts: 0,
        totalProblems: 0,
        unassignedProblems: 0,
        underReviewProblems: 0,
        awaitingInfoProblems: 0,
        resolvedProblems: 0,
        reopenedProblems: 0
      };

      const charts = payload.charts || {};
      const byCategory = payload.byCategory || charts.byCategory || [];
      const byCrop = payload.byCrop || charts.byCrop || [];
      const byStatus = payload.byStatus || charts.byStatus || [];
      const expertWorkload = payload.expertWorkload || charts.expertWorkload || [];
      const recentProblems = payload.recentProblems || payload.recentActivity || [];

      setData({
        counters,
        byCategory,
        byCrop,
        byStatus,
        expertWorkload,
        recentProblems,
      });
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const counters = data.counters || {};
  const byCategory = data.byCategory || [];
  const byCrop = data.byCrop || [];
  const byStatus = data.byStatus || [];
  const expertWorkload = data.expertWorkload || [];
  const recentProblems = data.recentProblems || [];

  // Chart 1: Status Distribution
  const statusLabels = byStatus.map((s) => s._id || 'Unknown');
  const statusCounts = byStatus.map((s) => s.count);
  const statusChartData = {
    labels: statusLabels.length > 0 ? statusLabels : ['No Cases'],
    datasets: [
      {
        data: statusCounts.length > 0 ? statusCounts : [1],
        backgroundColor: [
          '#EAB308', // SUBMITTED / yellow
          '#3B82F6', // UNDER_REVIEW / blue
          '#287A3E', // ASSIGNED / farm-green
          '#8B5CF6', // AWAITING / purple
          '#56A94F', // RESPONSE / leaf-green
          '#10B981', // RESOLVED / emerald
          '#EF4444'  // REOPENED / red
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // Chart 2: Category Breakdown
  const categoryLabels = byCategory.map((c) => c._id || c.categoryName || 'Other');
  const categoryCounts = byCategory.map((c) => c.count);
  const categoryChartData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['No Data'],
    datasets: [
      {
        data: categoryCounts.length > 0 ? categoryCounts : [1],
        backgroundColor: [
          '#174A2A',
          '#287A3E',
          '#56A94F',
          '#A5AD45',
          '#F59E0B',
          '#EC4899',
          '#6366F1',
          '#14B8A6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // Chart 3: Top Crops Affected
  const cropLabels = byCrop.slice(0, 6).map((c) => c._id || c.cropName || 'Crop');
  const cropCounts = byCrop.slice(0, 6).map((c) => c.count);
  const cropChartData = {
    labels: cropLabels.length > 0 ? cropLabels : ['No Data'],
    datasets: [
      {
        label: 'Reported Incidents',
        data: cropCounts.length > 0 ? cropCounts : [0],
        backgroundColor: '#287A3E',
        borderRadius: 8
      }
    ]
  };

  // Chart 4: Expert Workload
  const expertLabels = expertWorkload.map((e) => e.fullName || e.expertName || 'Expert');
  const expertCounts = expertWorkload.map((e) => e.activeCount ?? e.activeCases ?? 0);
  const workloadChartData = {
    labels: expertLabels.length > 0 ? expertLabels : ['No Experts'],
    datasets: [
      {
        label: 'Active Cases Assigned',
        data: expertCounts.length > 0 ? expertCounts : [0],
        backgroundColor: '#56A94F',
        borderRadius: 8
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pale-green/40 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-forest-green">Loading Farmora Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              Administrative Command Center
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Farmora Operations & Analytics
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Live MongoDB aggregates: Real-time caseload triage, expert distribution, and agronomic incidence metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/unassigned"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-sm text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              Unassigned Queue ({counters.unassignedProblems})
            </Link>
            <Link
              to="/admin/reports"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              All System Reports
            </Link>
          </div>
        </div>

        {/* 8 Primary KPI Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-farm p-5 border-l-4 border-l-forest-green">
            <span className="text-xs uppercase font-bold text-slate-500">Registered Farmers</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{counters.totalFarmers}</p>
            <p className="text-[11px] text-slate-500 mt-1">Verified farm accounts</p>
          </div>

          <div className="card-farm p-5 border-l-4 border-l-farm-green">
            <span className="text-xs uppercase font-bold text-slate-500">Active Agronomists</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{counters.totalExperts}</p>
            <p className="text-[11px] text-slate-500 mt-1">Specialists on duty</p>
          </div>

          <div className="card-farm p-5 border-l-4 border-l-amber-500">
            <span className="text-xs uppercase font-bold text-slate-500">Unassigned Cases</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{counters.unassignedProblems}</p>
            <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Awaiting dispatch
            </p>
          </div>

          <div className="card-farm p-5 border-l-4 border-l-emerald-600">
            <span className="text-xs uppercase font-bold text-slate-500">Resolved Cases</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{counters.resolvedProblems}</p>
            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Advisory verified
            </p>
          </div>
        </div>

        {/* Chart.js Analytics Grid (Section 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Status Distribution */}
          <div className="card-farm p-6">
            <h3 className="text-base font-bold text-forest-green font-serif mb-4 flex items-center justify-between">
              <span>Case Lifecycle Distribution</span>
              <span className="text-xs text-slate-500 font-normal">Real-time status</span>
            </h3>
            <div className="h-64 flex items-center justify-center">
              {byStatus.length > 0 ? (
                <Doughnut
                  data={statusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
                    }
                  }}
                />
              ) : (
                <p className="text-xs text-slate-400">No status metrics available</p>
              )}
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div className="card-farm p-6">
            <h3 className="text-base font-bold text-forest-green font-serif mb-4 flex items-center justify-between">
              <span>Incidence by Problem Category</span>
              <span className="text-xs text-slate-500 font-normal">Disease vs Pest vs Soil</span>
            </h3>
            <div className="h-64 flex items-center justify-center">
              {byCategory.length > 0 ? (
                <Doughnut
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
                    }
                  }}
                />
              ) : (
                <p className="text-xs text-slate-400">No category metrics available</p>
              )}
            </div>
          </div>

          {/* Chart 3: Top Affected Crops */}
          <div className="card-farm p-6">
            <h3 className="text-base font-bold text-forest-green font-serif mb-4 flex items-center justify-between">
              <span>Top Affected Crops</span>
              <span className="text-xs text-slate-500 font-normal">Report volume</span>
            </h3>
            <div className="h-64">
              {byCrop.length > 0 ? (
                <Bar
                  data={cropChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No crop incident data recorded
                </div>
              )}
            </div>
          </div>

          {/* Chart 4: Expert Caseload Workload */}
          <div className="card-farm p-6">
            <h3 className="text-base font-bold text-forest-green font-serif mb-4 flex items-center justify-between">
              <span>Agronomist Workload Distribution</span>
              <span className="text-xs text-slate-500 font-normal">Active assigned cases</span>
            </h3>
            <div className="h-64">
              {expertWorkload.length > 0 ? (
                <Bar
                  data={workloadChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No active expert caseload data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Admin Navigation Panels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/farmers"
            className="card-farm p-4 hover:border-farm-green transition-all flex items-center gap-3 text-slate-800"
          >
            <div className="w-10 h-10 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold shrink-0">
              <Users className="w-5 h-5 text-farm-green" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Farmers</p>
              <p className="text-sm font-semibold text-slate-900">Manage Accounts</p>
            </div>
          </Link>

          <Link
            to="/admin/experts"
            className="card-farm p-4 hover:border-farm-green transition-all flex items-center gap-3 text-slate-800"
          >
            <div className="w-10 h-10 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold shrink-0">
              <UserCheck className="w-5 h-5 text-farm-green" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Agronomists</p>
              <p className="text-sm font-semibold text-slate-900">Manage Experts</p>
            </div>
          </Link>

          <Link
            to="/admin/crops"
            className="card-farm p-4 hover:border-farm-green transition-all flex items-center gap-3 text-slate-800"
          >
            <div className="w-10 h-10 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold shrink-0">
              <Sprout className="w-5 h-5 text-farm-green" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Crop Master</p>
              <p className="text-sm font-semibold text-slate-900">Crops & Seasons</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="card-farm p-4 hover:border-farm-green transition-all flex items-center gap-3 text-slate-800"
          >
            <div className="w-10 h-10 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold shrink-0">
              <Layers className="w-5 h-5 text-farm-green" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Categories</p>
              <p className="text-sm font-semibold text-slate-900">Problem Taxonomy</p>
            </div>
          </Link>
        </div>

        {/* Recent Cases Stream Table */}
        <div className="card-farm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-light-green">
            <div>
              <h2 className="text-xl font-bold font-serif text-forest-green">
                Recent Incident Submissions
              </h2>
              <p className="text-xs text-slate-500">Latest problem reports entering the dispatch pipeline.</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-farm-green hover:underline">
              View All &rarr;
            </Link>
          </div>

          {recentProblems && recentProblems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Report #</th>
                    <th className="py-3 px-4">Crop</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Assigned Expert</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProblems.map((p) => (
                    <tr key={p._id} className="hover:bg-pale-green/20">
                      <td className="py-3 px-4 font-mono font-bold text-forest-green text-xs">
                        {p.reportNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-semibold">
                        {p.cropId?.name || p.crop?.name || 'Crop'}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {p.farmerId?.fullName || p.farmerId?.name || 'Farmer'}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-800">
                        {p.title}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {(p.assignedExpertId?.fullName || p.assignedTo?.name) ? (
                          <span className="font-semibold text-forest-green">
                            Dr. {p.assignedExpertId?.fullName || p.assignedTo?.name}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={(p.assignedExpertId || p.assignedTo) ? `/reports/${p._id}` : `/admin/assign/${p._id}`}
                          className="text-xs font-bold text-farm-green hover:underline"
                        >
                          {(p.assignedExpertId || p.assignedTo) ? 'View' : 'Assign'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No reports received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

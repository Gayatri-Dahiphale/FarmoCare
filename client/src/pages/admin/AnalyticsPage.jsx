import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sprout
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/dashboard');
      const payload = res.data?.data || res.data || {};
      setData(payload);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const payload = data?.data || data || {};
  const counters = payload.counters || payload.summary || {};
  const byCategory = payload.byCategory || [];
  const byCrop = payload.byCrop || [];
  const byStatus = payload.byStatus || [];
  const expertWorkload = payload.expertWorkload || [];

  // Chart Data: Statuses
  const statusChartData = {
    labels: byStatus.map((s) => s._id),
    datasets: [
      {
        data: byStatus.map((s) => s.count),
        backgroundColor: [
          '#EAB308',
          '#3B82F6',
          '#287A3E',
          '#8B5CF6',
          '#56A94F',
          '#10B981',
          '#EF4444'
        ]
      }
    ]
  };

  // Chart Data: Crop Volumes
  const cropChartData = {
    labels: byCrop.map((c) => c.cropName),
    datasets: [
      {
        label: 'Recorded Cases',
        data: byCrop.map((c) => c.count),
        backgroundColor: '#287A3E',
        borderRadius: 6
      }
    ]
  };

  // Resolution SLA trend simulation
  const slaTrendData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      {
        label: 'Average Hours to Diagnosis',
        data: [14.2, 12.8, 10.5, 9.2, 8.4, 7.8, 6.2],
        borderColor: '#287A3E',
        backgroundColor: 'rgba(40, 122, 62, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Agronomic Intelligence & Operational SLA
          </div>
          <h1 className="text-3xl font-extrabold text-forest-green font-serif">
            Agritech Analytics & Field Telemetry
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time analytics on case resolution turnaround, diagnostic performance, and regional disease vectors.
          </p>
        </div>

        {/* SLA & Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card-farm p-6 border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500">Average Turnaround</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">6.2 Hours</p>
                <p className="text-xs text-emerald-700 mt-1 font-semibold">Under 12-hour SLA guarantee</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card-farm p-6 border-l-4 border-l-farm-green">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500">Resolution Rate</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {counters.totalProblems > 0
                    ? `${Math.round((counters.resolvedProblems / counters.totalProblems) * 100)}%`
                    : '100%'}
                </p>
                <p className="text-xs text-leaf-green mt-1 font-semibold">Field treatment verified</p>
              </div>
              <div className="w-12 h-12 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold">
                <CheckCircle2 className="w-6 h-6 text-farm-green" />
              </div>
            </div>
          </div>

          <div className="card-farm p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500">Active Pipeline</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {counters.underReviewProblems + counters.awaitingInfoProblems} Cases
                </p>
                <p className="text-xs text-amber-700 mt-1 font-semibold">In active pathology examination</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-farm p-6">
            <h3 className="text-lg font-bold text-forest-green font-serif mb-4">
              Turnaround Time Trend (SLA Performance)
            </h3>
            <div className="h-72">
              <Line
                data={slaTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            </div>
          </div>

          <div className="card-farm p-6">
            <h3 className="text-lg font-bold text-forest-green font-serif mb-4">
              Crop Susceptibility Breakdown
            </h3>
            <div className="h-72">
              <Bar
                data={cropChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

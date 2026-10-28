import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileText,
  Search,
  Filter,
  Eye,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MapPin,
  Calendar,
  Download
} from 'lucide-react';

export default function AllReportsPage() {
  const { t, getCropName, getCategoryName } = useLanguage();
  const [problems, setProblems] = useState([]);
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [crop, setCrop] = useState('');
  const [category, setCategory] = useState('');

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [probRes, cropRes, catRes] = await Promise.all([
        apiClient.get('/admin/problems?limit=100'),
        apiClient.get('/crops'),
        apiClient.get('/categories')
      ]);
      const list = probRes.data?.problems || probRes.data?.data || (Array.isArray(probRes.data) ? probRes.data : []);
      setProblems(list);
      setCrops(cropRes.data?.crops || cropRes.data?.data || (Array.isArray(cropRes.data) ? cropRes.data : []));
      setCategories(catRes.data?.categories || catRes.data?.data || (Array.isArray(catRes.data) ? catRes.data : []));
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = problems.filter((p) => {
    const farmerName = p.farmerId?.fullName || p.farmerId?.name || '';
    const matchesSearch =
      (p.reportNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      farmerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || p.status === status;
    const matchesCrop = !crop || p.cropId?._id === crop;
    const matchesCat = !category || p.categoryId?._id === category;
    return matchesSearch && matchesStatus && matchesCrop && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleExportCSV = () => {
    if (filtered.length === 0) return alert('No reports available to export.');
    const headers = ['ReportNumber', 'Date', 'Crop', 'Category', 'Farmer', 'Village', 'District', 'AssignedExpert', 'Status', 'Title'];
    const rows = filtered.map((p) => {
      const exp = p.assignedExpertId || p.assignedTo;
      const expName = exp ? (exp.fullName || exp.name || 'Assigned') : 'Unassigned';
      return [
        p.reportNumber,
        new Date(p.createdAt || p.submittedAt || Date.now()).toISOString().split('T')[0],
        `"${p.cropId?.name || ''}"`,
        `"${p.categoryId?.name || ''}"`,
        `"${p.farmerId?.fullName || p.farmerId?.name || 'Farmer'}"`,
        `"${p.location?.village || ''}"`,
        `"${p.location?.district || ''}"`,
        `"${expName}"`,
        p.status,
        `"${(p.title || '').replace(/"/g, '""')}"`
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `farmora_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              Central Case Records
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              All Problem Reports
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Master repository of all incoming and resolved agricultural reports across regions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
              title="Export filtered records to CSV"
            >
              <Download className="w-4 h-4 text-farm-green" />
              Export CSV
            </button>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card-farm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search case #, farmer, or title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
              />
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="AWAITING_FARMER_INFO">AWAITING INFO</option>
                <option value="RESPONSE_PROVIDED">RESPONSE PROVIDED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REOPENED">REOPENED</option>
              </select>
            </div>

            <div>
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Crops</option>
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>{getCropName(c)}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{getCategoryName(cat)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Master Table */}
        <div className="card-farm overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No reports match your selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Report #</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Crop & Category</th>
                    <th className="py-3.5 px-4">Farmer</th>
                    <th className="py-3.5 px-4">Assigned Expert</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((p) => (
                    <tr key={p._id} className="hover:bg-pale-green/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-forest-green text-xs">
                        {p.reportNumber}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{getCropName(p.cropId) || p.cropId?.name || 'Crop'}</div>
                        <div className="text-xs text-slate-500">{getCategoryName(p.categoryId) || p.categoryId?.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{p.farmerId?.fullName || p.farmerId?.name || 'Farmer'}</div>
                        <div className="text-xs text-slate-500">{p.location?.village ? `${p.location.village}, ` : ''}{p.location?.district || ''}</div>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        {p.assignedExpertId || p.assignedTo ? (
                          <span className="font-semibold text-forest-green">
                            Dr. {(p.assignedExpertId?.fullName || p.assignedTo?.name || p.assignedExpertId?.name || 'Assigned Specialist')}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/assign/${p._id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-light-green text-forest-green rounded-lg text-xs font-semibold hover:bg-forest-green hover:text-white transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {p.assignedTo ? 'Reassign' : 'Assign'}
                          </Link>
                          <Link
                            to={`/reports/${p._id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing {(page - 1) * itemsPerPage + 1} to{' '}
                {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} reports
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-800">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

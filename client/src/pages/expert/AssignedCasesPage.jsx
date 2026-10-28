import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sprout
} from 'lucide-react';

export default function AssignedCasesPage() {
  const { t, getCropName, getCategoryName } = useLanguage();
  const [cases, setCases] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [casesRes, cropsRes] = await Promise.all([
        apiClient.get('/experts/cases?limit=100'),
        apiClient.get('/crops')
      ]);
      const caseList =
        casesRes.problems ||
        casesRes.data?.problems ||
        (Array.isArray(casesRes.data?.data) ? casesRes.data.data : null) ||
        (Array.isArray(casesRes.data) ? casesRes.data : []);
      setCases(caseList);

      const cropList =
        cropsRes.crops ||
        cropsRes.data?.crops ||
        (Array.isArray(cropsRes.data?.data) ? cropsRes.data.data : null) ||
        (Array.isArray(cropsRes.data) ? cropsRes.data : []);
      setCrops(cropList);
    } catch (err) {
      console.error('Failed to load assigned cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const farmerName = c.farmerId?.fullName || c.farmerId?.name || '';
    const cropName = getCropName(c.cropId) || c.cropId?.name || '';
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (c.title || '').toLowerCase().includes(q) ||
      (c.reportNumber || '').toLowerCase().includes(q) ||
      farmerName.toLowerCase().includes(q) ||
      cropName.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q);
    const matchesStatus =
      !statusFilter ||
      c.status === statusFilter ||
      (statusFilter === 'AWAITING_FARMER_INFO' &&
        (c.status === 'AWAITING_FARMER_INFORMATION' || c.status === 'AWAITING_FARMER_INFO'));
    const matchesCrop = !cropFilter || c.cropId?._id === cropFilter || c.cropId === cropFilter;
    return matchesSearch && matchesStatus && matchesCrop;
  });

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title & Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              Agronomist Workstation
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Assigned Clinical Cases
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Total assigned: <span className="font-semibold text-slate-900">{cases.length} reports</span>
            </p>
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Caseload
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="card-farm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Report #, farmer, or symptoms..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="ASSIGNED">Assigned (New)</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="AWAITING_FARMER_INFO">Awaiting Info</option>
                <option value="RESPONSE_PROVIDED">Response Provided</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            {/* Crop Filter */}
            <div>
              <select
                value={cropFilter}
                onChange={(e) => {
                  setCropFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Crops</option>
                {crops.map((crop) => (
                  <option key={crop._id} value={crop._id}>
                    {getCropName(crop) || crop.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Master Caseload Table */}
        <div className="card-farm overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="py-16 text-center">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No cases found matching criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the search terms or filters above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Case ID</th>
                    <th className="py-3.5 px-4">Date Reported</th>
                    <th className="py-3.5 px-4">Crop & Category</th>
                    <th className="py-3.5 px-4">Farmer & Village</th>
                    <th className="py-3.5 px-4">Problem Subject</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCases.map((c) => (
                    <tr key={c._id} className="hover:bg-pale-green/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-forest-green text-xs">
                        {c.reportNumber}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{getCropName(c.cropId) || c.cropId?.name || 'Crop'}</div>
                        <div className="text-xs text-slate-500">{getCategoryName(c.categoryId) || c.categoryId?.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{c.farmerId?.fullName || c.farmerId?.name || 'Farmer'}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-leaf-green" />
                          {c.location?.village}, {c.location?.district}
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="truncate font-semibold text-slate-800">{c.title}</p>
                        <p className="text-xs text-slate-500 truncate">{c.description}</p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/expert/cases/${c._id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-forest-green text-white rounded-xl text-xs font-semibold hover:bg-forest-green/90 transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Examine
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing {(page - 1) * itemsPerPage + 1} to{' '}
                {Math.min(page * itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
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

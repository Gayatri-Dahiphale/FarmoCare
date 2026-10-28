import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw,
  Power
} from 'lucide-react';

export default function FarmerManagementPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/users?role=farmer&limit=100');
      const list =
        res.users ||
        res.data?.users ||
        (Array.isArray(res.data?.data) ? res.data.data : null) ||
        (Array.isArray(res.data) ? res.data : []);
      const formatted = list.map((f) => ({
        ...f,
        name: f.fullName || f.name || 'Farmer',
        isActive: f.accountStatus ? f.accountStatus === 'active' : (f.isActive ?? true),
      }));
      setFarmers(formatted);
    } catch (err) {
      console.error('Failed to load farmers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const isCurrentlyActive = user.accountStatus ? user.accountStatus === 'active' : (user.isActive ?? true);
    const action = isCurrentlyActive ? 'deactivate' : 'activate';
    const targetStatus = isCurrentlyActive ? 'inactive' : 'active';
    if (!window.confirm(`Are you sure you want to ${action} ${(user.name || user.fullName || 'this farmer')}'s account?`)) return;

    try {
      setTogglingId(user._id);
      await apiClient.patch(`/admin/users/${user._id}/status`, {
        accountStatus: targetStatus,
        isActive: !isCurrentlyActive
      });
      fetchFarmers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status');
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = farmers.filter((f) => {
    const q = (search || '').toLowerCase();
    const nameMatch = (f.name || f.fullName || '').toLowerCase().includes(q);
    const emailMatch = (f.email || '').toLowerCase().includes(q);
    const phoneMatch = f.phone ? String(f.phone).includes(q) : false;
    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              User Governance
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Farmer Accounts Management
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Directory of verified farmer accounts, contact details, and account activation controls.
            </p>
          </div>

          <button
            onClick={fetchFarmers}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="card-farm p-4 sm:p-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by farmer name, email, or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
            />
          </div>
        </div>

        {/* Farmers Table */}
        <div className="card-farm overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No farmer accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Farmer Name</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Geographic Locality</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Account Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((farmer) => (
                    <tr key={farmer._id} className="hover:bg-pale-green/20">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {farmer.name || farmer.fullName}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Mail className="w-3.5 h-3.5 text-leaf-green" />
                          {farmer.email}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-leaf-green" />
                          {farmer.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-leaf-green" />
                          {farmer.location?.village || 'Village'}, {farmer.location?.district || 'District'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {new Date(farmer.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            farmer.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {farmer.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(farmer)}
                          disabled={togglingId === farmer._id}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            farmer.isActive
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {farmer.isActive ? 'Deactivate' : 'Activate'}
                        </button>
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

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  UserCheck,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Award,
  Briefcase,
  Power,
  RefreshCw,
  X
} from 'lucide-react';

export default function ExpertManagementPage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // New Expert Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    qualification: ''
  });
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/experts');
      setExperts(res.data.experts || []);
    } catch (err) {
      console.error('Failed to load experts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (expert) => {
    const action = expert.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} Dr. ${expert.name}'s account?`)) return;

    try {
      setTogglingId(expert._id);
      await apiClient.patch(`/admin/users/${expert._id}/status`, {
        isActive: !expert.isActive
      });
      fetchExperts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateExpert = async (e) => {
    e.preventDefault();
    setCreating(true);
    setModalError('');

    try {
      await apiClient.post('/admin/users', {
        ...formData,
        role: 'EXPERT'
      });
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
        qualification: ''
      });
      fetchExperts();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create expert account.');
    } finally {
      setCreating(false);
    }
  };

  const filtered = experts.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.specialization && e.specialization.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4" />
              Specialist Onboarding & Accreditation
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Agriculture Experts Directory
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage clinical agronomists, board specializations, and authorized clinical credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchExperts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Onboard Agronomist
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card-farm p-4 sm:p-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor name, email, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
            />
          </div>
        </div>

        {/* Experts Table */}
        <div className="card-farm overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No agronomist accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Agronomist</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Specialization</th>
                    <th className="py-3.5 px-4">Qualification</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Account Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((expert) => (
                    <tr key={expert._id} className="hover:bg-pale-green/20">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">Dr. {expert.name}</div>
                        <div className="text-xs text-forest-green font-semibold">Registered Agronomist</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Mail className="w-3.5 h-3.5 text-leaf-green" />
                          {expert.email}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-leaf-green" />
                          {expert.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className="font-semibold text-slate-800 bg-light-green/60 px-2 py-0.5 rounded">
                          {expert.specialization || 'General Agronomy'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {expert.qualification || 'M.Sc. Agriculture'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            expert.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {expert.isActive ? (
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
                          onClick={() => handleToggleStatus(expert)}
                          disabled={togglingId === expert._id}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            expert.isActive
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {expert.isActive ? 'Deactivate' : 'Activate'}
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

      {/* Onboard New Expert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-forest-green mb-1">
              Onboard Agriculture Expert
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create an authorized agronomist profile with login credentials.
            </p>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateExpert} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="expert@farmora.care"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 chars"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Qualification</label>
                  <input
                    type="text"
                    required
                    placeholder="Ph.D. / M.Sc. Agronomy"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Diagnostic Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plant Pathology & Soil Chemistry"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary text-sm px-6 py-2"
                >
                  {creating ? 'Creating...' : 'Create Expert Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

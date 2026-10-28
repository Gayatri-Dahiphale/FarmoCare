import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  Sprout,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Power,
  X
} from 'lucide-react';

export default function CropManagementPage() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'Cereal',
    season: 'Kharif',
    description: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/crops');
      setCrops(res.data.crops || []);
    } catch (err) {
      console.error('Failed to load crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await apiClient.post('/crops', formData);
      setShowModal(false);
      setFormData({
        name: '',
        scientificName: '',
        category: 'Cereal',
        season: 'Kharif',
        description: ''
      });
      fetchCrops();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create crop');
    } finally {
      setCreating(false);
    }
  };

  const filtered = crops.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.scientificName && c.scientificName.toLowerCase().includes(search.toLowerCase())) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4" />
              Agronomic Taxonomy Master
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Crops & Cultivation Master
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Configure agricultural species, botanical nomenclature, and seasonal cropping calendars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCrops}
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
              Add New Crop
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card-farm p-4 sm:p-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search crop name, botanical name, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
            />
          </div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((crop) => (
            <div key={crop._id} className="card-farm p-6 flex flex-col justify-between hover:border-farm-green transition-all shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-forest-green font-serif">{crop.name}</h3>
                    <p className="text-xs italic text-slate-500">{crop.scientificName || 'Botanical name unlisted'}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 bg-light-green text-forest-green rounded-full shrink-0">
                    {crop.season || 'All Season'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mt-3">
                  <p><span className="font-semibold text-slate-800">Category:</span> {crop.category || 'General Crop'}</p>
                  {crop.description && (
                    <p className="text-slate-500 line-clamp-2 mt-2">{crop.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active in Platform
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Crop Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-forest-green mb-1">Add Agricultural Crop</h3>
            <p className="text-xs text-slate-500 mb-4">Register a new cultivated crop into the diagnostics taxonomy.</p>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Common Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groundnut (Peanut)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Botanical / Scientific Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arachis hypogaea"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Classification</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
                  >
                    <option value="Cereal">Cereal</option>
                    <option value="Cash Crop">Cash Crop</option>
                    <option value="Pulse">Pulse</option>
                    <option value="Oilseed">Oilseed</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cropping Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="Perennial">Perennial / Annual</option>
                  </select>
                </div>
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
                  {creating ? 'Saving...' : 'Add Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

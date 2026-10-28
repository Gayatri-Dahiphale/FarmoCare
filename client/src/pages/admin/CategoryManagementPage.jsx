import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  X,
  AlertTriangle,
  Bug,
  ShieldAlert,
  FlaskConical,
  Droplets,
  CloudRain,
  Sparkles,
  HelpCircle,
  Sprout,
  Flame,
  Wind,
  Sun
} from 'lucide-react';

const ICON_MAP = {
  Bug,
  ShieldAlert,
  FlaskConical,
  Droplets,
  CloudRain,
  Sparkles,
  HelpCircle,
  Sprout,
  Layers,
  Flame,
  Wind,
  Sun,
  AlertTriangle,
};

const renderCategoryIcon = (iconName, catName) => {
  if (iconName && ICON_MAP[iconName]) {
    const IconComp = ICON_MAP[iconName];
    return <IconComp className="w-6 h-6 text-forest-green" />;
  }

  // If it's an emoji (e.g. 🌾, 🐛, 🍃)
  if (iconName && typeof iconName === 'string' && iconName.length <= 4) {
    return <span className="text-2xl">{iconName}</span>;
  }

  // Name based heuristics fallback
  const norm = (catName || '').toLowerCase();
  if (norm.includes('pest') || norm.includes('insect')) return <Bug className="w-6 h-6 text-forest-green" />;
  if (norm.includes('disease') || norm.includes('blight')) return <ShieldAlert className="w-6 h-6 text-forest-green" />;
  if (norm.includes('nutrient') || norm.includes('fertilizer')) return <FlaskConical className="w-6 h-6 text-forest-green" />;
  if (norm.includes('irrigation') || norm.includes('water')) return <Droplets className="w-6 h-6 text-forest-green" />;
  if (norm.includes('weather') || norm.includes('rain')) return <CloudRain className="w-6 h-6 text-forest-green" />;
  if (norm.includes('weed')) return <Sparkles className="w-6 h-6 text-forest-green" />;
  if (norm.includes('soil')) return <Layers className="w-6 h-6 text-forest-green" />;
  if (norm.includes('other')) return <HelpCircle className="w-6 h-6 text-forest-green" />;

  return <Sprout className="w-6 h-6 text-forest-green" />;
};

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Sprout'
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await apiClient.post('/categories', formData);
      setShowModal(false);
      setFormData({ name: '', description: '', icon: 'Sprout' });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const filtered = categories.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Agronomic Problem Taxonomy
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Problem Categories Master
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Configure diagnostic classifications for crop diseases, pest infestations, irrigation deficits, and nutrient deficiencies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCategories}
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
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((cat) => (
            <div key={cat._id} className="card-farm p-6 flex flex-col justify-between hover:border-farm-green transition-all shadow-sm">
              <div>
                <div className="w-12 h-12 bg-light-green rounded-xl flex items-center justify-center mb-3 shadow-sm text-forest-green">
                  {renderCategoryIcon(cat.icon, cat.name)}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {cat.description || 'Agricultural category used for problem reporting and automated similarity classification.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active in Workflow
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-forest-green mb-1">Add Problem Category</h3>
            <p className="text-xs text-slate-500 mb-4">Introduce a new diagnostic classification for farmer triage.</p>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nematode Infestation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Taxonomy Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-800"
                >
                  <option value="Bug">🐛 Pest Infestation (Bug)</option>
                  <option value="ShieldAlert">🛡️ Crop Disease (ShieldAlert)</option>
                  <option value="FlaskConical">🧪 Nutrient Deficiency (FlaskConical)</option>
                  <option value="Droplets">💧 Irrigation Problem (Droplets)</option>
                  <option value="CloudRain">🌧️ Weather Damage (CloudRain)</option>
                  <option value="Sparkles">✨ Weed Management (Sparkles)</option>
                  <option value="Layers">🪴 Soil Problem (Layers)</option>
                  <option value="Sprout">🌱 Crop Growth (Sprout)</option>
                  <option value="HelpCircle">❓ Other Problem (HelpCircle)</option>
                  <option value="Flame">🔥 Heat / Fire (Flame)</option>
                  <option value="Wind">💨 Wind / Storm (Wind)</option>
                  <option value="Sun">☀️ Sun / Drought (Sun)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Symptoms and diagnostic scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {creating ? 'Saving...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  Search,
  Filter,
  BookOpen,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function SimilarSolvedPage() {
  const { getCropName, getCategoryName } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeta();
    searchSolutions();
  }, []);

  const loadMeta = async () => {
    try {
      const [cropsRes, catRes] = await Promise.all([
        apiClient.get('/crops'),
        apiClient.get('/categories')
      ]);
      setCrops(cropsRes.data.crops || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const searchSolutions = async () => {
    try {
      setLoading(true);
      // Fetch resolved cases across the repository
      const res = await apiClient.get('/problems?status=RESOLVED');
      let list = res.data.problems || [];

      if (selectedCrop) {
        list = list.filter(c => c.cropId?._id === selectedCrop);
      }
      if (selectedCategory) {
        list = list.filter(c => c.categoryId?._id === selectedCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.reportNumber.toLowerCase().includes(q)
        );
      }
      setCases(list);
    } catch (err) {
      console.error('Failed to load solutions repository:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-leaf-green" />
              Agronomic Knowledge Repository
            </div>
            <h1 className="text-3xl font-extrabold text-forest-green font-serif">
              Similar Solved Cases Repository
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Browse verified clinical treatment protocols and resolved field reports across all regions.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card-farm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search symptom, disease name, or chemical remedy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
              />
            </div>

            <div>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Crops</option>
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>{getCropName(c) || c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Problem Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{getCategoryName(cat) || cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={searchSolutions}
              className="btn-primary text-sm px-6 py-2"
            >
              Search Repository
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cases.length === 0 ? (
          <div className="card-farm p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No verified resolved cases found</h3>
            <p className="text-xs text-slate-500 mt-1">Try broadening your crop or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((c) => (
              <div key={c._id} className="card-farm p-6 flex flex-col justify-between hover:border-farm-green transition-all shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-forest-green bg-light-green px-2.5 py-0.5 rounded-full">
                      {c.reportNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{c.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-forest-green">{getCropName(c.cropId) || c.cropId?.name}</span>
                    <span>•</span>
                    <span>{getCategoryName(c.categoryId) || c.categoryId?.name}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {c.description}
                  </p>

                  {/* Solved treatment summary */}
                  {c.responses && c.responses.length > 0 && (
                    <div className="p-3 bg-pale-green/50 rounded-xl border border-light-green text-xs space-y-1 mb-4">
                      <span className="font-bold text-forest-green block">Verified Prescription:</span>
                      <p className="text-slate-800 line-clamp-3 font-medium">
                        {c.responses[c.responses.length - 1].recommendations}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Locality: {c.location?.district || 'India'}</span>
                  <span className="font-semibold text-forest-green flex items-center gap-0.5">
                    Field Tested <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

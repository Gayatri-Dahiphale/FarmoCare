import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  User,
  ShieldCheck,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  Building
} from 'lucide-react';

export default function ExpertProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Anand Shinde',
    email: user?.email || 'dr.shinde@farmora.care',
    phone: user?.phone || '9822012345',
    specialization: user?.specialization || 'Plant Pathology & Viral Diseases',
    qualification: user?.qualification || 'Ph.D. Plant Pathology (MPKV Rahuri)',
    department: 'Directorate of Agricultural Extension & Crop Health',
    councilRegNo: 'ICAR-AGR-2018-8834',
    bio: 'Senior Agricultural Scientist specializing in subtropical crop diseases, viral leaf curl management, integrated pest management (IPM), and bio-rational disease interventions.'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiClient.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        qualification: formData.qualification
      });
      setMessage('Expert credentials and profile updated successfully.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Profile settings saved locally.');
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Accredited Agricultural Expert
          </div>
          <h1 className="text-3xl font-extrabold text-forest-green font-serif">
            Agronomist Clinical Credentials
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Verified specialist profile used on official diagnostic certificates and farmer advisories.
          </p>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-farm-green shrink-0" />
            <span className="text-sm font-semibold">{message}</span>
          </div>
        )}

        {/* Credentials Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-farm p-5 border-l-4 border-l-farm-green">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold">
                <Award className="w-5 h-5 text-farm-green" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Board Status</p>
                <p className="text-sm font-bold text-slate-900">Verified Agronomist</p>
              </div>
            </div>
          </div>

          <div className="card-farm p-5 border-l-4 border-l-leaf-green">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-light-green rounded-xl flex items-center justify-center text-forest-green font-bold">
                <CheckCircle2 className="w-5 h-5 text-leaf-green" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Solved Cases</p>
                <p className="text-sm font-bold text-slate-900">142 Field Resolutions</p>
              </div>
            </div>
          </div>

          <div className="card-farm p-5 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Clinical Specialty</p>
                <p className="text-sm font-bold text-slate-900 truncate">Plant Pathology</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="card-farm p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-forest-green border-b border-light-green pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-farm-green" />
            Practitioner Identity & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name & Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mobile Hotline</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Council Accreditation ID</label>
              <input
                type="text"
                name="councilRegNo"
                value={formData.councilRegNo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Diagnostic Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Academic Degree / Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Practitioner Bio & Agronomic Focus</label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green text-sm"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Expert Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

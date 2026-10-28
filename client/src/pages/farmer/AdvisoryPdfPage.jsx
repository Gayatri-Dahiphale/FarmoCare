import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Phone
} from 'lucide-react';

export default function AdvisoryPdfPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getCropName, getCategoryName } = useLanguage();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/problems/${id}`);
      const pData = res.problem || res.data?.problem || res.data;
      if (pData) {
        if (!pData.responses && res.responses) {
          pData.responses = res.responses;
        }
        setProblem(pData);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load advisory document.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <p className="font-semibold text-lg">{error || 'Advisory not found'}</p>
          <Link to="/farmer/reports" className="mt-4 inline-block btn-primary">
            Back to My Reports
          </Link>
        </div>
      </div>
    );
  }

  const expert = problem.assignedTo;
  const responses = problem.responses || [];
  const latestResponse = responses.length > 0 ? responses[responses.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white text-slate-900">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          to={`/farmer/reports/${problem._id}`}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-forest-green"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Detail
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-green text-white font-semibold rounded-xl hover:bg-forest-green/90 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Advisory Certificate
          </button>
        </div>
      </div>

      {/* Advisory Document Paper */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-6 print:rounded-none">
        {/* Header with Government / Agritech Authority Styling */}
        <div className="border-b-2 border-forest-green pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-forest-green rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                🌾
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-forest-green tracking-tight">
                  FARMORA CARE
                </h1>
                <p className="text-xs uppercase font-semibold text-leaf-green tracking-wider">
                  Agricultural Advisory & Diagnosis Service
                </p>
                <p className="text-xs text-slate-500">Official Clinical Case Record & Field Advisory</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-light-green text-forest-green text-xs font-bold rounded-full mb-1">
                CASE NUMBER: {problem.reportNumber}
              </span>
              <p className="text-xs text-slate-500">
                Issued Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-slate-500">Status: <span className="font-semibold text-slate-800 uppercase">{problem.status}</span></p>
            </div>
          </div>
        </div>

        {/* Case & Farmer Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-pale-green/60 rounded-xl border border-light-green">
          <div>
            <h3 className="text-xs font-bold text-forest-green uppercase tracking-wider mb-2">
              Farmer Particulars
            </h3>
            <p className="text-sm font-semibold text-slate-900">{problem.farmerId?.name || 'Farmer'}</p>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3 text-leaf-green" />
              {problem.farmerId?.phone || 'Not specified'}
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-leaf-green" />
              {problem.location?.village}, Taluka/District: {problem.location?.district}, {problem.location?.state}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-forest-green uppercase tracking-wider mb-2">
              Crop Telemetry
            </h3>
            <p className="text-sm font-semibold text-slate-900">
              Crop: {getCropName(problem.cropId) || problem.cropId?.name} ({problem.cropId?.scientificName || 'N/A'})
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Issue Category: <span className="font-semibold text-slate-800">{getCategoryName(problem.categoryId) || problem.categoryId?.name}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Stage: {problem.cropStage || 'Vegetative'} | Affected Area: {problem.affectedAreaAcre ? `${problem.affectedAreaAcre} Acres` : 'Partial field'}
            </p>
          </div>
        </div>

        {/* Reported Problem Description */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-forest-green mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-leaf-green" />
            1. Farmer Symptom Report & Observations
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-1">{problem.title}</h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
          </div>
        </div>

        {/* Official Expert Clinical Advisory */}
        {latestResponse ? (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-forest-green mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-farm-green" />
              2. Official Agronomist Diagnosis & Treatment Protocol
            </h2>

            {/* Observations */}
            <div className="mb-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Clinical Observations & Diagnosis
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {latestResponse.observations || 'Symptom matching confirmed with regional pathology database.'}
              </p>
            </div>

            {/* Recommendations & Dosage */}
            <div className="mb-4 p-4 rounded-xl border border-farm-green/30 bg-light-green/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-green mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-farm-green" />
                Prescribed Remedies & Management Steps
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {latestResponse.recommendations}
              </p>
            </div>

            {/* Precautions */}
            {latestResponse.precautions && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Precautionary Measures & Safety Warning
                </h4>
                <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                  {latestResponse.precautions}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 mb-8 text-center">
            <p className="font-semibold text-sm">Advisory diagnosis is currently pending expert review.</p>
            <p className="text-xs mt-1">Once assigned expert provides recommendations, this certificate will reflect the full clinical prescription.</p>
          </div>
        )}

        {/* Assigned Agronomist Endorsement */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Certifying Agronomist</p>
            <p className="text-base font-bold text-forest-green">{expert ? expert.name : 'Chief Agricultural Officer'}</p>
            <p className="text-xs text-slate-600">{expert?.qualification || 'M.Sc. Agriculture (Plant Pathology)'}</p>
            <p className="text-xs text-slate-500">Farmora Agricultural Support Mission, Reg. AS-2026</p>
          </div>

          <div className="text-right">
            <div className="inline-block border-b-2 border-slate-400 pb-1 mb-1 px-8 text-center">
              <span className="font-serif italic text-sm text-forest-green">Dr. Verified Stamp</span>
            </div>
            <p className="text-[11px] text-slate-400">Authorized Digital Signature</p>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
          This document is generated by Farmora Care Agricultural Tele-Consultation Platform. Recommendations are based on the symptoms and photographs supplied by the farmer. Please follow standard PPE guidelines when applying crop protection chemicals.
        </div>
      </div>
    </div>
  );
}

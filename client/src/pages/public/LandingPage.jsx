import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Camera,
  Search,
  MessageSquare,
  Award,
  ChevronRight,
  CheckCircle2,
  Bug,
  Droplets,
  Sprout,
  ShieldAlert,
  Layers,
  FlaskConical,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleReportCTA = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/farmer/new-report');
    } else if (user?.role === 'farmer') {
      navigate('/farmer/new-report');
    } else if (user?.role === 'expert') {
      navigate('/expert/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 2.3 Required Landing-Page Hero Banner */}
      <section className="relative w-full min-h-[520px] lg:h-[62vh] flex items-center overflow-hidden">
        {/* Background Wide Photographic Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_panoramic_farmers.png"
            alt="Indian farmers tending lush green crops in Maharashtra at sunrise"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Forest Green Gradient Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest/85 to-forest/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/20" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/25 border border-leaf/40 text-sage-light text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-leaf-light shrink-0" />
              <span>{t('heroBadge', 'Certified AgriTech Advisory & University Agronomists')}</span>
            </div>

            {/* Mandatory Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {t('heroHeadline1', 'Healthy Crops.')} <br />
              <span className="text-sage-light">{t('heroHeadline2', 'Stronger Farmers.')}</span>
            </h1>

            {/* Mandatory Supporting Copy */}
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-medium">
              {t('heroSubtitle', 'Identify crop problems, connect with agricultural experts, and get guidance to protect your harvest.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={handleReportCTA}
                className="btn-primary text-base py-3.5 px-7 shadow-lg shadow-black/20 text-white font-bold"
              >
                {t('reportCropProblem', 'Report a Crop Problem')}
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-md"
              >
                {t('exploreHowItWorks', 'Explore How It Works')}
              </Link>
            </div>

            {/* Short Trust Message */}
            <div className="pt-4 flex items-center gap-6 text-xs text-white/80 border-t border-white/15 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-leaf-light" />
                <span>{t('trustProtocol', 'Verified MPKV & ICAR Protocols')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-leaf-light" />
                <span>{t('trustSla', 'Under 2-Hour Response SLA')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">
            {t('pipelineTitle', 'A Structured Digital Pipeline for Crop Health')}
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted">
            {t('pipelineSubtitle', 'Replacing informal WhatsApp advice with verified diagnosis, historical case matching, and traceable farmer follow-ups.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="card-farm-hover overflow-hidden flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img
                src="/images/smiling_farmer_phone.png"
                alt="Smiling farmer using Farmora Care smartphone app"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-forest/85 text-white text-xs font-semibold backdrop-blur-sm">
                {t('step1Badge', 'Step 1: Rapid Reporting')}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-forest mb-2">{t('step1Title', '1. Photo & Symptoms Upload')}</h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {t('step1Desc', 'Capture close-ups of affected leaves, stems, or pests. Tag your crop, growth stage, and locality to instantly route the report.')}
                </p>
              </div>
              <Link to="/farmer/new-report" className="text-sm font-semibold text-farm inline-flex items-center gap-1">
                {t('step1Action', 'Submit a Report')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-farm-hover overflow-hidden flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img
                src="/images/officer_farmer_consultation.png"
                alt="Agronomist field officer inspecting crops with cultivator"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-forest/85 text-white text-xs font-semibold backdrop-blur-sm">
                {t('step2Badge', 'Step 2: Specialist Triage')}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-forest mb-2">{t('step2Title', '2. Certified Expert Consultation')}</h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {t('step2Desc', 'Qualified entomologists, virologists, and agronomists evaluate symptoms, prescribe validated dosages, and track recovery.')}
                </p>
              </div>
              <Link to="/about" className="text-sm font-semibold text-farm inline-flex items-center gap-1">
                {t('step2Action', 'Meet the Agronomists')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-farm-hover overflow-hidden flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img
                src="/images/expert_leaf_inspection.png"
                alt="Agricultural specialist inspecting leaf texture with magnifying glass"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-forest/85 text-white text-xs font-semibold backdrop-blur-sm">
                {t('step3Badge', 'Core Feature')}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-forest mb-2">{t('step3Title', '3. Similar Solved Problems')}</h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {t('step3Desc', 'Our similarity engine compares newly submitted symptoms with verified historical cases to give experts immediate clinical precedent.')}
                </p>
              </div>
              <Link to="/how-it-works" className="text-sm font-semibold text-farm inline-flex items-center gap-1">
                {t('step3Action', 'How Similarity Works')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Categories Band */}
      <section className="bg-sprout/40 border-y border-charcoal-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-farm uppercase tracking-widest">{t('diagnosticCoverageBadge', 'Diagnostic Coverage')}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest mt-1">
                {t('commonChallengesTitle', 'Common Agricultural Challenges Supported')}
              </h2>
            </div>
            <Link to="/farmer/new-report" className="btn-secondary text-sm self-start">
              {t('browseFullIndex', 'Browse Full Diagnostic Index')}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { key: 'catCropDisease', titleKey: 'catCropDisease', descKey: 'catCropDiseaseDesc', icon: ShieldAlert, fallbackTitle: 'Crop Disease', fallbackDesc: 'Foliar blight, rust, wilt, powdery mildew' },
              { key: 'catPestAttack', titleKey: 'catPestAttack', descKey: 'catPestAttackDesc', icon: Bug, fallbackTitle: 'Pest Attack', fallbackDesc: 'Pink bollworm, thrips, aphids, whitefly' },
              { key: 'catIrrigation', titleKey: 'catIrrigation', descKey: 'catIrrigationDesc', icon: Droplets, fallbackTitle: 'Irrigation Stress', fallbackDesc: 'Drip clogging, root saturation, moisture drop' },
              { key: 'catNutrition', titleKey: 'catNutrition', descKey: 'catNutritionDesc', icon: Layers, fallbackTitle: 'Soil Nutrition', fallbackDesc: 'Soil salinity, chlorosis, trace element balance' },
              { key: 'catFertilizerBurn', titleKey: 'catFertilizerBurn', descKey: 'catFertilizerBurnDesc', icon: FlaskConical, fallbackTitle: 'Fertilizer Burn', fallbackDesc: 'Over-dosage, nitrogen scorch, urea shock' },
              { key: 'catWeather', titleKey: 'catWeather', descKey: 'catWeatherDesc', icon: Sprout, fallbackTitle: 'Weather Damage', fallbackDesc: 'Hailstorm recovery, sun scald, wind lodging' },
              { key: 'catStunted', titleKey: 'catStunted', descKey: 'catStuntedDesc', icon: Sparkles, fallbackTitle: 'Stunted Growth', fallbackDesc: 'Poor germination, delayed tiller initiation' },
              { key: 'catGeneral', titleKey: 'catGeneral', descKey: 'catGeneralDesc', icon: Award, fallbackTitle: 'General Advisory', fallbackDesc: 'Pruning guidelines, harvest readiness, spacing' },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="card-farm p-5 hover:border-farm transition-all space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-sprout flex items-center justify-center text-farm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-forest text-sm">{t(cat.titleKey, cat.fallbackTitle)}</h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{t(cat.descKey, cat.fallbackDesc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Resolution Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-forest p-8 sm:p-12 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-light">{t('ctaBadge', 'Official Advisory')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              {t('ctaTitle', 'Notice Unusual Symptoms in Your Field?')}
            </h2>
            <p className="text-sm sm:text-base text-sage-light/90 leading-relaxed">
              {t('ctaDesc', 'Do not let untreated pests or diseases destroy your seasonal harvest. Get an authoritative case dossier and verified prescription within hours.')}
            </p>
            <div className="pt-2">
              <button
                onClick={handleReportCTA}
                className="btn-primary bg-leaf hover:bg-leaf-dark text-white font-bold py-3 px-6 shadow-md"
              >
                {t('ctaButton', 'Report Problem Now')}
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full lg:w-96 rounded-xl overflow-hidden border border-white/20 shadow-xl shrink-0">
            <img
              src="/images/macro_leaf_pest.png"
              alt="Macro leaf pest inspection showing caterpillar feeding damage"
              className="w-full h-56 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="p-4 bg-forest-dark/95 text-xs text-sage-light/80 space-y-1">
              <div className="font-bold text-white">{t('evidenceTelemetryTitle', 'Field Case Evidence Telemetry')}</div>
              <div>{t('evidenceTelemetryDesc', 'Diagnostic high-resolution leaf texture capture supported for all crops.')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

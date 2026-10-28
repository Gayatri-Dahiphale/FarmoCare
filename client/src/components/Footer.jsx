import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest text-white border-t border-forest-dark/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-farm flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-sage-light" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Farmora<span className="text-sage-light">Care</span>
              </span>
            </div>
            <p className="text-sm text-sage-light/80 leading-relaxed max-w-sm">
              {t('footerDesc', 'Connecting Indian farmers with certified agricultural universities, Krishi Vigyan Kendras, and state agronomists for prompt crop diagnosis, pest management, and harvest preservation.')}
            </p>
            <div className="flex items-center gap-2 text-xs text-sage-light/60 pt-2">
              <ShieldCheck className="w-4 h-4 text-leaf" />
              <span>Verified Agro-Scientific Advisory Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-light">{t('farmersPortal', 'Farmers Portal')}</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/farmer/new-report" className="hover:text-white transition-colors">{t('reportProblem', 'Report Crop Problem')}</Link></li>
              <li><Link to="/farmer/reports" className="hover:text-white transition-colors">{t('myReports', 'My Case Timeline')}</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">{t('howItWorks', 'How Reporting Works')}</Link></li>
              <li><Link to="/farmer/farm-profile" className="hover:text-white transition-colors">{t('farmProfile', 'Field Telemetry Setup')}</Link></li>
            </ul>
          </div>

          {/* Specialist & Advisory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-light">{t('agronomyLab', 'Agronomy & Lab')}</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/expert/dashboard" className="hover:text-white transition-colors">{t('dashboard', 'Specialist Console')}</Link></li>
              <li><Link to="/formulary" className="hover:text-white transition-colors">{t('formulary', 'Chemical Formulary')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('about', 'Accredited Experts')}</Link></li>
              <li><Link to="/settings/edge-diagnostics" className="hover:text-white transition-colors">Edge Diagnostics</Link></li>
            </ul>
          </div>

          {/* Emergency Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-light">{t('kisanHelpline', 'Kisan Helpline')}</h4>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-leaf shrink-0" />
                <span className="font-semibold text-white">1800-180-1551 ({t('tollFree', 'Toll Free')})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-leaf shrink-0" />
                <span>support@farmora.care</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-sage-light/70 pt-1">
                <MapPin className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                <span>MPKV Agronomy Hub, Rahuri, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-light/60 gap-4">
          <p>© {new Date().getFullYear()} Farmora Care Platform. Academic Full-Stack Minor Project.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">{t('privacyCharter', 'Privacy Charter')}</Link>
            <Link to="/how-it-works" className="hover:text-white transition-colors">{t('slaStandards', 'SLA Standards')}</Link>
            <Link to="/contact" className="hover:text-white transition-colors">{t('districtDesks', 'District Desks')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

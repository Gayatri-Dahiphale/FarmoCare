import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-farm px-3 py-1 rounded-full bg-sprout">
          {t('contactBadge', 'Assistance & Desks')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          {t('contactTitle', 'Help & Agronomy Desks')}
        </h1>
        <p className="text-base text-charcoal-muted leading-relaxed">
          {t('contactSubtitle', 'Need urgent assistance with an active crop outbreak or technical guidance? Reach out to our district agricultural support centers.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-farm p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sprout flex items-center justify-center text-farm">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-forest">{t('contactTollFree', 'Kisan Toll-Free Hotline')}</h3>
          <p className="text-sm text-charcoal-muted">{t('contactTollFreeDesc', 'Dial directly for immediate phone triage and verbal guidance.')}</p>
          <div className="text-base font-bold text-farm">1800-180-1551</div>
          <div className="text-xs text-charcoal-muted">{t('contactTollFreeTime', 'Available Mon–Sat: 07:00 AM – 07:00 PM IST')}</div>
        </div>

        <div className="card-farm p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sprout flex items-center justify-center text-farm">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-forest">{t('contactDesk', 'Direct Advisory Desk')}</h3>
          <p className="text-sm text-charcoal-muted">{t('contactDeskDesc', 'Send high-resolution batch photos or official university inquiries.')}</p>
          <div className="text-base font-bold text-farm">advisory@farmora.care</div>
          <div className="text-xs text-charcoal-muted">{t('contactDeskSla', 'Target Response SLA: Within 4 Hours')}</div>
        </div>

        <div className="card-farm p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sprout flex items-center justify-center text-farm">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-forest">{t('contactHub', 'Central Extension Hub')}</h3>
          <p className="text-sm text-charcoal-muted">{t('contactHubDesc', 'Faculty of Agriculture & Agro-Informatics Division.')}</p>
          <div className="text-sm font-semibold text-charcoal">{t('contactHubLoc', 'MPKV Campus, Rahuri, Maharashtra')}</div>
          <div className="text-xs text-charcoal-muted">PIN: 413722, India</div>
        </div>
      </div>
    </div>
  );
}


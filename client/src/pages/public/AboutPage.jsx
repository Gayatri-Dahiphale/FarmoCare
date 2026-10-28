import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Award, Users, BookOpen, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-farm px-3 py-1 rounded-full bg-sprout">
          {t('aboutBadge', 'Institutional Stewardship')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          {t('aboutTitle', 'About Farmora Care')}
        </h1>
        <p className="text-base text-charcoal-muted leading-relaxed">
          {t('aboutSubtitle', 'Farmora Care was conceived as a digital extension platform that bridges the gap between grassroots Indian farming communities and certified agricultural science faculties.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-forest">
            {t('aboutH2', 'Empowering Agricultural Extension through Structured Data')}
          </h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {t('aboutP1', 'In many rural areas, crop pest outbreaks and fungal infections spread rapidly while farmers rely on hearsay or retail pesticide shop recommendations that often sell inappropriate or over-priced chemicals.')}
          </p>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {t('aboutP2', 'Farmora Care establishes an authenticated, accountable chain of guidance. Every advisory issued by our agronomists is backed by institutional credentials from accredited agricultural research centers, ensuring safety, environmental stewardship, and minimal chemical residues.')}
          </p>
          <div className="space-y-3 pt-2">
            {[
              t('aboutBullet1', 'Direct connection with university plant pathology laboratories'),
              t('aboutBullet2', 'Traceable audit trails for all chemical recommendations'),
              t('aboutBullet3', 'Zero automated AI hallucinations—real experts review real evidence'),
              t('aboutBullet4', 'Preservation of historical resolved cases to accelerate future diagnoses'),
            ].map((pt, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-charcoal font-medium">
                <CheckCircle className="w-5 h-5 text-farm shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-charcoal-border shadow-lg">
          <img
            src="/images/farmer_sunrise_field.png"
            alt="Farmer walking through lush agricultural fields at sunrise"
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="p-6 bg-white space-y-2">
            <h4 className="font-bold text-forest">{t('aboutCardTitle', 'Empirical Field Science in Rural Maharashtra')}</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {t('aboutCardDesc', 'Designed for high readability in high-glare field environments, supporting Marathi, Hindi, and English agricultural lexicons.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, Send, UserCheck, MessageSquare, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: t('step01Title', 'Farmer Submits Incident Report'),
      desc: t('step01Desc', 'The cultivator notices symptoms in the field—leaf discoloration, curling, spots, or insects. Using a smartphone or computer, the farmer uploads clear photographs, selects the affected crop, categorizes the problem, and specifies the village/district.'),
      icon: Camera,
      badge: 'Capture & Localize',
    },
    {
      step: '02',
      title: t('step02Title', 'Admin Review & Workload Triage'),
      desc: t('step02Desc', 'The report enters the central triage console. Regional administrators verify geographic jurisdiction and assign the dossier to the most qualified agronomist or plant pathologist based on current caseload and crop specialty.'),
      icon: UserCheck,
      badge: 'Balanced Triage',
    },
    {
      step: '03',
      title: t('step03Title', 'Specialist Diagnosis & Similar Cases'),
      desc: t('step03Desc', 'The assigned agronomist opens the digital dossier. The Similar Solved Problems engine automatically surfaces previously resolved cases with identical crop and category parameters, allowing the specialist to verify treatment precedents before issuing guidance.'),
      icon: ShieldCheck,
      badge: 'Precedent Intelligence',
    },
    {
      step: '04',
      title: t('step04Title', 'Formal Advisory & Follow-Up Resolution'),
      desc: t('step04Desc', 'The expert issues structured observations, recommended chemical/organic interventions, and safety notes. If needed, additional information is requested. The farmer implements guidance, reports progress, and the case reaches formal verified resolution.'),
      icon: CheckCircle,
      badge: 'Traceable Outcome',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-farm px-3 py-1 rounded-full bg-sprout">
          {t('workflowArch', 'Workflow Architecture')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          {t('howItWorksHeadline', 'How Farmora Care Connects Fields to Agronomy Specialists')}
        </h1>
        <p className="text-base text-charcoal-muted leading-relaxed">
          {t('howItWorksSub', 'From the moment leaf symptoms appear in rural Maharashtra to the delivery of verified crop treatment protocols, here is how the 4-phase advisory pipeline works.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="card-farm p-8 space-y-4 relative overflow-hidden group hover:border-farm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-sage-light group-hover:text-leaf transition-colors">
                  {item.step}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sprout text-forest">
                  {item.badge}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-farm text-white flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-forest">{item.title}</h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="card-farm p-8 bg-sprout/40 flex flex-col sm:flex-row items-center justify-between gap-6 border-farm/20">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-forest">{t('ctaTitle', 'Ready to test the digital reporting workflow?')}</h4>
          <p className="text-sm text-charcoal-muted">{t('ctaDesc', 'Submit a sample crop observation and watch the case move through triage.')}</p>
        </div>
        <Link to="/farmer/new-report" className="btn-primary shrink-0">
          {t('reportCropProblem', 'Report a Problem')} <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}

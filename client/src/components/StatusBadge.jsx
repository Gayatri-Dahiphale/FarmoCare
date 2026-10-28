import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const STATUS_CONFIG = {
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  ASSIGNED: {
    label: 'Assigned',
    className: 'bg-blue-50 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    className: 'bg-purple-50 text-purple-800 border-purple-200',
    dot: 'bg-purple-500',
  },
  AWAITING_FARMER_INFORMATION: {
    label: 'Awaiting Info',
    className: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
  },
  AWAITING_FARMER_INFO: {
    label: 'Awaiting Info',
    className: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
  },
  RESPONSE_PROVIDED: {
    label: 'Response Provided',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-sprout text-forest border-leaf/40',
    dot: 'bg-farm',
  },
  REOPENED: {
    label: 'Reopened',
    className: 'bg-orange-50 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
  };

  const localizedLabel = t(status, config.label);
  const sizeClasses = size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.className} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {localizedLabel}
    </span>
  );
}

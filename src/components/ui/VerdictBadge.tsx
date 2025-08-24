import React from 'react';
import { Verdict } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface VerdictBadgeProps {
  verdict: Verdict;
  language: string;
  size?: 'sm' | 'md';
}

export function VerdictBadge({ verdict, language, size = 'md' }: VerdictBadgeProps) {
  const getVerdictStyles = (verdict: Verdict) => {
    switch (verdict) {
      case 'Unverified':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Accurate':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Out of Context':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Misleading':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Altered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getVerdictStyles(verdict)} ${sizeClasses[size]}`}>
      {t(verdict, language)}
    </span>
  );
}
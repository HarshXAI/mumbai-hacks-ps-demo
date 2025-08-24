import React from 'react';

interface TrustScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  confidence?: number;
  evidenceCount?: number;
}

export function TrustScore({ 
  score, 
  size = 'md', 
  showTooltip = false, 
  confidence, 
  evidenceCount 
}: TrustScoreProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-600 dark:stroke-emerald-400';
    if (score >= 60) return 'stroke-amber-600 dark:stroke-amber-400';
    if (score >= 40) return 'stroke-orange-600 dark:stroke-orange-400';
    return 'stroke-red-600 dark:stroke-red-400';
  };

  return (
    <div className="relative group">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="100, 100"
            className="text-gray-200 dark:text-gray-700"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="2"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={getStrokeColor(score)}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${textSizeClasses[size]} font-semibold ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          <div>Trust Score: {score}</div>
          {confidence && <div>Confidence: {confidence}%</div>}
          {evidenceCount && <div>Evidence: {evidenceCount} sources</div>}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}
    </div>
  );
}
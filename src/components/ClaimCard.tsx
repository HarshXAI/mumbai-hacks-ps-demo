import React from 'react';
import { ExternalLink, Share2, Eye, Flag } from 'lucide-react';
import { Claim } from '../contexts/AppContext';
import { VerdictBadge } from './ui/VerdictBadge';
import { TrustScore } from './ui/TrustScore';
import { ViralityChart } from './ui/ViralityChart';
import { useAppContext } from '../contexts/AppContext';
import { t } from '../utils/translations';

interface ClaimCardProps {
  claim: Claim;
  onClick: () => void;
}

export function ClaimCard({ claim, onClick }: ClaimCardProps) {
  const { state } = useAppContext();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {claim.title}
          </h3>
          <div className="flex items-center space-x-2 mb-3">
            <VerdictBadge verdict={claim.verdict} language={state.language} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {claim.source.handle} • {claim.source.timestamp}
            </span>
          </div>
        </div>
        
        <TrustScore 
          score={claim.trustScore} 
          size="md" 
          showTooltip={true}
          confidence={claim.confidence}
          evidenceCount={claim.evidenceCount}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <span>{claim.mediaType}</span>
          <span>{claim.source.platform}</span>
          <span>{claim.region}</span>
        </div>
        <div className="w-20">
          <ViralityChart data={claim.virality} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClick}
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{t('openClaim', state.language)}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">{t('share', state.language)}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            {t('followTopic', state.language)}
          </button>
          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
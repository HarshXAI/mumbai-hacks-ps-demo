import { Share2, Eye, Flag } from 'lucide-react';
// import { Claim } from '../contexts/AppContext'; // Commented out to avoid strict type errors
import { VerdictBadge } from './ui/VerdictBadge';
import { TrustScore } from './ui/TrustScore';
import { ViralityChart } from './ui/ViralityChart';
import { useAppContext } from '../contexts/AppContext';
import { t } from '../utils/translations';

interface ClaimCardProps {
  claim: any; // Using 'any' to be flexible with live data
  onClick: () => void;
}

export function ClaimCard({ claim, onClick }: ClaimCardProps) {
  const { state } = useAppContext();

  // --- SAFETY ADAPTERS (Fixes "Undefined" crashes) ---
  // These checks ensure the card works even if some data is missing from the Live Feed
  const handle = claim.author?.handle || claim.source?.handle || "@unknown";
  const timestamp = claim.timestamp || claim.source?.timestamp || "Just now";
  const platform = claim.source?.platform || "Social Media";
  const score = claim.score ?? claim.trustScore ?? 50;
  
  // Mock chart data if missing (since live feed doesn't generate charts instantly)
  const viralityData = claim.virality || [10, 25, 40, 35, 50, 65, 85];

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
              {handle} • {timestamp}
            </span>
          </div>
        </div>
        
        <TrustScore 
          score={score} 
          size="md" 
          showTooltip={true}
          confidence={claim.confidence || 0.85}
          evidenceCount={claim.evidenceCount || 5}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {claim.mediaType}
          </span>
          <span>{platform}</span>
          <span className="uppercase">{claim.region || "National"}</span>
        </div>
        <div className="w-20">
          <ViralityChart data={viralityData} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
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
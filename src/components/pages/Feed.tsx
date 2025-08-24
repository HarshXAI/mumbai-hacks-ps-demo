import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { ClaimCard } from '../ClaimCard';
import { ClaimDetail } from '../ClaimDetail';
import { useAppContext } from '../../contexts/AppContext';
import { sampleClaims } from '../../data/sampleData';
import { t } from '../../utils/translations';

export function Feed() {
  const { state, dispatch } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredClaims, setFilteredClaims] = useState(sampleClaims);

  useEffect(() => {
    // Apply filters
    let filtered = sampleClaims.filter(claim => {
      if (state.filters.mediaType.length > 0 && !state.filters.mediaType.includes(claim.mediaType)) {
        return false;
      }
      if (state.filters.verdict.length > 0 && !state.filters.verdict.includes(claim.verdict)) {
        return false;
      }
      if (state.filters.region !== 'all' && claim.region !== state.filters.region) {
        return false;
      }
      return true;
    });
    setFilteredClaims(filtered);
  }, [state.filters]);

  const handleClaimClick = (claim: any) => {
    dispatch({ type: 'SET_SELECTED_CLAIM', payload: claim });
  };

  const mediaTypes = ['Text', 'Video', 'Image', 'Screenshot', 'Audio'];
  const verdicts = ['Unverified', 'Accurate', 'Misleading', 'Out of Context', 'Altered'];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Feed</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Media Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('filterByMediaType', state.language)}
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {mediaTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={state.filters.mediaType.includes(type as any)}
                      onChange={(e) => {
                        const current = state.filters.mediaType;
                        const updated = e.target.checked
                          ? [...current, type as any]
                          : current.filter(t => t !== type);
                        dispatch({ 
                          type: 'UPDATE_FILTERS', 
                          payload: { mediaType: updated } 
                        });
                      }}
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verdict Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('filterByVerdict', state.language)}
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {verdicts.map((verdict) => (
                  <label key={verdict} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={state.filters.verdict.includes(verdict as any)}
                      onChange={(e) => {
                        const current = state.filters.verdict;
                        const updated = e.target.checked
                          ? [...current, verdict as any]
                          : current.filter(v => v !== verdict);
                        dispatch({ 
                          type: 'UPDATE_FILTERS', 
                          payload: { verdict: updated } 
                        });
                      }}
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t(verdict, state.language)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <div className="space-y-1">
                {(['en', 'hi', 'mr'] as const).map((lang) => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={state.filters.language.includes(lang)}
                      onChange={(e) => {
                        const current = state.filters.language;
                        const updated = e.target.checked
                          ? [...current, lang]
                          : current.filter(l => l !== lang);
                        dispatch({ 
                          type: 'UPDATE_FILTERS', 
                          payload: { language: updated } 
                        });
                      }}
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredClaims.length > 0 ? (
          filteredClaims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onClick={() => handleClaimClick(claim)}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No flagged items in this window. Try expanding filters.
            </p>
          </div>
        )}
      </div>

      {/* Claim Detail Modal */}
      {state.selectedClaim && (
        <ClaimDetail
          claim={state.selectedClaim}
          onClose={() => dispatch({ type: 'SET_SELECTED_CLAIM', payload: null })}
        />
      )}
    </div>
  );
}
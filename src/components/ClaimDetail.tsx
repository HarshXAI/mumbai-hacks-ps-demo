import React, { useState } from 'react';
import { X, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import { Claim } from '../contexts/AppContext';
import { VerdictBadge } from './ui/VerdictBadge';
import { TrustScore } from './ui/TrustScore';
import { useAppContext } from '../contexts/AppContext';
import { t } from '../utils/translations';

interface ClaimDetailProps {
  claim: Claim;
  onClose: () => void;
}

export function ClaimDetail({ claim, onClose }: ClaimDetailProps) {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: t('overview', state.language) },
    { id: 'evidence', label: t('evidence', state.language) },
    { id: 'forensics', label: t('mediaForensics', state.language) },
    { id: 'lineage', label: t('lineage', state.language) },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {claim.title}
            </h2>
            <div className="flex items-center space-x-4">
              <VerdictBadge verdict={claim.verdict} language={state.language} />
              <TrustScore 
                score={claim.trustScore} 
                size="lg" 
                confidence={claim.confidence}
                evidenceCount={claim.evidenceCount}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What this means</h3>
                <p className="text-blue-800 dark:text-blue-200">
                  {claim.summary || 'Analysis summary will appear here based on the selected language.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {claim.evidence?.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {item.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.timestamp}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{item.quote}"</p>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400">No evidence available for this claim.</p>
              )}
            </div>
          )}

          {activeTab === 'forensics' && (
            <div className="space-y-6">
              {claim.forensics?.type === 'video' && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Video Analysis</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {claim.forensics.frames?.map((frame, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Frame {index + 1}</span>
                      </div>
                    ))}
                  </div>
                  {claim.forensics.audioSpoofScore !== undefined && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Audio Analysis</h4>
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        Audio spoof score: {claim.forensics.audioSpoofScore}% (Low risk)
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {claim.forensics?.metadata && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Metadata</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <dl className="space-y-2">
                      {Object.entries(claim.forensics.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-sm text-gray-500 dark:text-gray-400">{key}:</dt>
                          <dd className="text-sm text-gray-900 dark:text-white font-mono">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lineage' && (
            <div className="space-y-6">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <p>Propagation analysis and network graph would be displayed here.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex space-x-4">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
              Subscribe to updates
            </button>
            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
              <Download className="w-4 h-4" />
              <span>Export citations (PDF)</span>
            </button>
          </div>
          <button className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm transition-colors">
            <AlertTriangle className="w-4 h-4" />
            <span>Appeal/Contest</span>
          </button>
        </div>
      </div>
    </div>
  );
}
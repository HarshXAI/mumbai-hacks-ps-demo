import { useState, useEffect } from 'react';
import { Filter, RefreshCw, Activity } from 'lucide-react';
import { ClaimCard } from '../ClaimCard';
import { ClaimDetail } from '../ClaimDetail';
import { useAppContext } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

// --- 1. INITIAL DATA ---
const INITIAL_ITEMS = [
  {
    id: 101,
    title: "Candidate X promised to waive all student loans by 2026.",
    verdict: "Misleading",
    author: {
      name: "News Watch",
      handle: "@newsaccount",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    mediaType: "Video",
    region: "national",
    language: "en",
    engagement: { likes: 1200, shares: 450 },
    score: 32,
    timestamp: "2h ago",
    overview: "The viral clip removes the conditional context ('If the economy grows...').",
    evidence: [
      { source: "Official Manifesto P.45", date: "2024-10-01", snippet: "Loans waived subject to 10% GDP growth." },
      { source: "Reuters Fact Check", date: "2024-11-12", snippet: "Clip cuts off the first sentence." }
    ],
    forensics: { isManipulated: true, score: 0.88, details: "Jump cut detected at 0:14.", tool: "MesoNet v4" },
    lineage: { origin: "@meme_bot_22", velocity: "High", amplifiers: ["@bot_network_A"] }
  },
  {
    id: 102,
    title: "Fuel tax cut announced today by Finance Ministry.",
    verdict: "Accurate",
    author: {
      name: "Govt News",
      handle: "@govtnews",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    mediaType: "Text",
    region: "national",
    language: "en",
    engagement: { likes: 5000, shares: 1200 },
    score: 98,
    timestamp: "3h ago",
    overview: "Confirmed via official Ministry press release #45/2025.",
    evidence: [
      { source: "Ministry of Finance", date: "Today", snippet: "Excise duty reduced by ₹2/liter." }
    ],
    forensics: { isManipulated: false, score: 0.02, details: "Text matches official records 100%.", tool: "TextMatch" },
    lineage: { origin: "Official Press Release", velocity: "Normal", amplifiers: ["Mainstream Media"] }
  },
  {
    id: 103,
    title: "This rally video shows last night's crowd in Mumbai.",
    verdict: "Out of Context",
    author: {
      name: "Political Watch",
      handle: "@politicalwatch",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop"
    },
    mediaType: "Video",
    region: "mumbai",
    language: "en",
    engagement: { likes: 340, shares: 80 },
    score: 45,
    timestamp: "4h ago",
    overview: "Video is real but from 2019, not last night.",
    evidence: [
      { source: "Reverse Image Search", date: "2019-05-12", snippet: "Identical footage found on YouTube from 5 years ago." }
    ],
    forensics: { isManipulated: false, score: 0.10, details: "Video is authentic, but metadata date is 2019.", tool: "Metadata Check" },
    lineage: { origin: "Facebook Group 'Old Memories'", velocity: "Medium", amplifiers: ["Local WhatsApp Groups"] }
  },
  {
    id: 104,
    title: "Leaked audio claims EVM tampering in District 9.",
    verdict: "Altered",
    author: {
      name: "Whistleblower X",
      handle: "@whistleblower_x",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    },
    mediaType: "Audio",
    region: "national",
    language: "hi",
    engagement: { likes: 15000, shares: 8900 },
    score: 12,
    timestamp: "5h ago",
    overview: "Audio is AI-generated using a voice clone of the official.",
    evidence: [
      { source: "Election Commission", date: "Today", snippet: "District 9 EVMs are sealed in strong room." }
    ],
    forensics: { isManipulated: true, score: 0.99, details: "Spectral analysis shows lack of breath pauses. AI trace found.", tool: "Resemblyzer" },
    lineage: { origin: "Anonymous Telegram", velocity: "Viral", amplifiers: ["Bot Farm 99"] }
  },
  {
    id: 105,
    title: "Manifesto PDF: Party A promises 50% reservation.",
    verdict: "Accurate",
    author: {
      name: "Fact Check Bureau",
      handle: "@factcheck_bureau",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop"
    },
    mediaType: "Image",
    region: "delhi",
    language: "hi",
    engagement: { likes: 890, shares: 210 },
    score: 95,
    timestamp: "6h ago",
    overview: "Screenshot matches page 12 of the official PDF.",
    evidence: [
      { source: "Party Official Website", date: "Yesterday", snippet: "Page 12: 'We pledge 50% reservation...'" }
    ],
    forensics: { isManipulated: false, score: 0.05, details: "No pixel tampering detected.", tool: "ELA Analysis" },
    lineage: { origin: "Official Twitter Handle", velocity: "Normal", amplifiers: ["Party Workers"] }
  },
  {
    id: 106,
    title: "Viral bridge collapse image is from 2016.",
    verdict: "Misleading",
    author: {
      name: "Viral Bot",
      handle: "@viral_bot",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
    },
    mediaType: "Image",
    region: "maharashtra",
    language: "mr",
    engagement: { likes: 45, shares: 12 },
    score: 5,
    timestamp: "12h ago",
    overview: "Image is from the Kolkata flyover collapse (2016), not the current project.",
    evidence: [
      { source: "Google Images", date: "2016-03-31", snippet: "Matches archival news photos from 2016." }
    ],
    forensics: { isManipulated: false, score: 0.01, details: "Image is real, but caption is false context.", tool: "Reverse Search" },
    lineage: { origin: "Clickbait Blog", velocity: "Low", amplifiers: ["None"] }
  }
];

// --- 2. LIVE EVENTS POOL ---
const LIVE_EVENTS_POOL = [
  {
    title: "BREAKING: Footage of voting machine malfunction goes viral.",
    verdict: "Unverified",
    author: { name: "Citizen Watch", handle: "@citizen_watch", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
    mediaType: "Video",
    region: "national",
    language: "en",
    engagement: { likes: 120, shares: 45 },
    score: 50,
    overview: "Video shows an LED error on a VVPAT machine. Election Commission officials are currently investigating the specific booth ID shown in the clip.",
    evidence: [],
    forensics: { isManipulated: false, score: 0.15, details: "Pending deep scan.", tool: "In Progress..." },
    lineage: { origin: "Live Upload", velocity: "Rising", amplifiers: [] }
  },
  {
    title: "ALERT: Deepfake audio of Candidate Z circulating.",
    verdict: "Altered",
    author: { name: "Truth Bot AI", handle: "@truth_bot_ai", avatar: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=100&h=100&fit=crop" },
    mediaType: "Audio",
    region: "mumbai",
    language: "hi",
    engagement: { likes: 2300, shares: 5000 },
    score: 5,
    overview: "Audio clip where Candidate Z appears to insult local voters is synthetically generated. The background noise loop repeats every 3 seconds, a hallmark of cheap AI tools.",
    evidence: [{source: "AI Detector", date: "Now", snippet: "99% Probability of ElevenLabs"}],
    forensics: { isManipulated: true, score: 0.99, details: "Synthetic voice pattern matching.", tool: "AudioForensic" },
    lineage: { origin: "Unknown WhatsApp", velocity: "Viral", amplifiers: ["BotNet"] }
  },
  {
    title: "Fact Check: No new lockdown announced.",
    verdict: "Accurate",
    author: { name: "Health Ministry", handle: "@health_ministry", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
    mediaType: "Text",
    region: "national",
    language: "en",
    engagement: { likes: 4000, shares: 1000 },
    score: 98,
    overview: "Official denial issued by Health Secretary.",
    evidence: [{source: "PIB Fact Check", date: "Now", snippet: "Fake notice circulating."}],
    forensics: { isManipulated: false, score: 0.0, details: "Official Statement.", tool: "SourceVerify" },
    lineage: { origin: "Government Handle", velocity: "High", amplifiers: ["News Agencies"] }
  }
];

export function Feed() {
  const { state, dispatch } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  
  const [allClaims, setAllClaims] = useState<any[]>(INITIAL_ITEMS);
  const [filteredClaims, setFilteredClaims] = useState<any[]>(INITIAL_ITEMS);
  const [isLive, setIsLive] = useState(true);

  // --- 3. SMART 5-SECOND UPDATE (No Repetition) ---
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomEvent = LIVE_EVENTS_POOL[Math.floor(Math.random() * LIVE_EVENTS_POOL.length)];
      
      setAllClaims(prev => {
        if (prev.length > 0 && prev[0].title === randomEvent.title) {
          return prev; // Skip update if duplicate
        }

        const newItem = {
          ...randomEvent,
          id: Date.now(),
          timestamp: "Just now",
          isNew: true
        };
        return [newItem, ...prev];
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [isLive]);

  // --- 4. FILTER LOGIC ---
  useEffect(() => {
    let filtered = allClaims.filter((claim: any) => {
      if (state.filters.mediaType.length > 0 && !state.filters.mediaType.includes(claim.mediaType)) return false;
      if (state.filters.verdict.length > 0 && !state.filters.verdict.includes(claim.verdict)) return false;
      if (state.filters.region !== 'all' && claim.region !== state.filters.region) return false;
      if (state.filters.language.length > 0 && !state.filters.language.includes(claim.language)) return false;
      return true;
    });
    setFilteredClaims(filtered);
  }, [state.filters, allClaims]);

  const handleClaimClick = (claim: any) => {
    dispatch({ type: 'SET_SELECTED_CLAIM', payload: claim });
  };

  const mediaTypes = ['Text', 'Video', 'Image', 'Screenshot', 'Audio'];
  const verdicts = ['Unverified', 'Accurate', 'Misleading', 'Out of Context', 'Altered'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Feed</h2>
            {isLive && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                LIVE
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLive 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              {isLive ? 'Pause' : 'Go Live'}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
            
            {/* NOTE: Manifesto button removed from here (Moved to Sidebar) */}

            <button 
              onClick={() => setAllClaims(INITIAL_ITEMS)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Section (Restored) */}
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
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500 rounded"
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
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500 rounded"
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
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500 rounded"
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
        {filteredClaims.map((claim: any) => (
          <div key={claim.id} className={claim.isNew ? 'animate-in slide-in-from-top-8 duration-700' : ''}>
            <ClaimCard
              claim={claim}
              onClick={() => handleClaimClick(claim)}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {state.selectedClaim && (
        <ClaimDetail
          claim={state.selectedClaim}
          onClose={() => dispatch({ type: 'SET_SELECTED_CLAIM', payload: null })}
        />
      )}
    </div>
  );
}
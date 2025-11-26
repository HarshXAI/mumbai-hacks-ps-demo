import { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, Newspaper, TrendingUp, ArrowRight, Globe, Activity, Shield } from 'lucide-react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { LeftNav } from './components/layout/LeftNav';
import { RightRail } from './components/layout/RightRail';
// --- Page Imports ---
import { Feed } from './components/pages/Feed';
import { Submissions } from './components/pages/Submissions';
import { Alerts } from './components/pages/Alerts';
import { Settings } from './components/pages/Settings';
import { Manifesto } from './components/pages/Manifesto';
import { FamilyGuard } from './components/pages/FamilyGuard';
import { SourceRadar } from './components/pages/SourceRadar';
import { Academy } from './components/pages/Academy';
import { CyberSentry } from './components/pages/CyberSentry';
import { TruthLine } from './components/pages/TruthLine';
import { LegalLens } from './components/pages/LegalLens';
import { TrustDashboard } from './components/pages/TrustDashboard';
import { TimelineTracer } from './components/pages/TimelineTracer'; // <--- Added Missing Import

// --- UI Components ---
import { ThinkingProcess, AgentThought } from './components/ui/ThinkingProcess';
import { AnalysisResult } from './components/ui/AnalysisResult';

// --- SUGGESTED TOPICS ---
const SUGGESTIONS = [
  "Deepfake video of Finance Minister announcing tax hike",
  "Voice note on WhatsApp claiming bank server hack",
  "Viral image of broken bridge in Metro City",
  "Election Commission banning pink polling booths"
];

// --- AGENT INTELLIGENCE COMPONENT ---
const AgentAnalysisPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  const handleCheck = async (textOverride?: string) => {
    const textToCheck = textOverride || query;
    if (!textToCheck) return;

    setQuery(textToCheck);
    setLoading(true);
    setResult(null);
    setThoughts([]);
    setSources([]);

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: textToCheck,
          media_url: "placeholder_video.mp4" 
        })
      });

      const data = await res.json();
      setResult(data.analysis);
      setThoughts(data.thoughts || []);
      setSources(data.sources || []);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error: Could not connect to TruthLens Agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-2 pb-12">
      
      {/* LIVE STATUS BAR */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-900 text-slate-300 p-3 px-6 rounded-full border border-slate-800 shadow-lg text-xs font-mono hidden md:flex">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>SYSTEM ONLINE</span>
        </div>
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Globe size={14} className="text-blue-400"/> Sources: 12.4M</span>
          <span className="flex items-center gap-1.5"><Activity size={14} className="text-purple-400"/> Agents Active: 3</span>
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-yellow-400"/> Threat Level: LOW</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="text-center space-y-3 py-6">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Truth<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Lens</span> Intelligence
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Deploy autonomous AI agents to investigate rumors, verify media, and trace propagation networks in real-time.
        </p>
      </div>

      {/* MAIN SEARCH INPUT */}
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 ${loading ? 'opacity-75 animate-pulse' : ''}`}></div>
        <div className="relative bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex gap-2 items-center">
          <Search className="ml-4 text-slate-400" size={24} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="Paste a URL, claim, or rumor to investigate..."
            className="flex-1 bg-transparent px-4 py-4 text-lg outline-none text-slate-800 dark:text-white placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={() => handleCheck()}
            disabled={loading}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Investigate"}
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!result && !loading && thoughts.length === 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Suggested Investigations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUGGESTIONS.map((sug, i) => (
              <button 
                key={i} 
                onClick={() => handleCheck(sug)}
                className="text-left p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{sug}</span>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* THINKING PROCESS */}
      {(loading || thoughts.length > 0) && (
        <ThinkingProcess thoughts={thoughts} loading={loading} />
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* RESULTS */}
        {result && <AnalysisResult result={result} />}

        {/* INTELLIGENCE FEED */}
        {sources.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <Newspaper size={20} className="text-blue-500" /> Source Intelligence ({sources.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition border border-slate-100 dark:border-slate-700 hover:border-blue-200 group relative overflow-hidden"
                >
                  <div className={`w-1 h-full absolute left-0 top-0 ${i % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  
                  <div className="min-w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm border border-slate-200 dark:border-slate-600 ml-2">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate group-hover:underline group-hover:text-blue-600">
                      {new URL(source).hostname.replace('www.', '')}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{source}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP WRAPPER ---
function AppContent() {
  const { state } = useAppContext();

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'intelligence': return <AgentAnalysisPage />;
      case 'dashboard': return <TrustDashboard />;
      
      case 'feed': return <Feed />;
      case 'manifesto': return <Manifesto />;
      case 'timeline': return <TimelineTracer />;
      case 'family-guard': return <FamilyGuard />;
      case 'source-radar': return <SourceRadar />;
      case 'academy': return <Academy />;
      case 'cyber-sentry': return <CyberSentry />;
      case 'truth-line': return <TruthLine />;
      case 'legal-lens': return <LegalLens />;
      case 'submissions': return <Submissions />;
      case 'alerts': return <Alerts />;
      case 'settings': return <Settings />;
      
      default: return <TrustDashboard />; 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans selection:bg-blue-500/30">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <LeftNav />
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {renderCurrentPage()}
        </main>
        <RightRail />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
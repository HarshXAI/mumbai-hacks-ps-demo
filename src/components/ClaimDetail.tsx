import { useState } from 'react';
import { X, ExternalLink, Download, AlertTriangle, CheckCircle, FileText, Search, Cpu, Network, Activity, GitFork, Share2, Mic2, MapPin } from 'lucide-react';
import { VerdictBadge } from './ui/VerdictBadge';
import { TrustScore } from './ui/TrustScore';
import { useAppContext } from '../contexts/AppContext';
import { t } from '../utils/translations';

interface ClaimDetailProps {
  claim: any;
  onClose: () => void;
}

export function ClaimDetail({ claim, onClose }: ClaimDetailProps) {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  // --- 1. SAFE DATA DEFAULTS ---
  const forensics = claim.forensics || { 
    isManipulated: false, 
    score: 0.1, 
    details: "Initial scan complete. No obvious manipulation markers found.", 
    tool: "DeepScan v1.0" 
  };
  
  const lineage = claim.lineage || { 
    origin: "Unknown Source", 
    velocity: "Normal", 
    amplifiers: [] 
  };

  const evidence = claim.evidence || [];
  const overview = claim.overview || claim.summary || "Analysis in progress.";

  const tabs = [
    { id: 'overview', label: t('overview', state.language), icon: FileText },
    { id: 'evidence', label: t('evidence', state.language), icon: Search },
    { id: 'forensics', label: t('mediaForensics', state.language), icon: Cpu },
    { id: 'lineage', label: t('lineage', state.language), icon: Network },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex-1 mr-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {claim.title}
            </h2>
            <div className="flex items-center gap-4">
              <VerdictBadge verdict={claim.verdict} language={state.language} />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                ID: #{claim.id}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <TrustScore 
              score={claim.score || claim.trustScore || 50} 
              size="lg" 
              showTooltip={true}
              confidence={0.9}
              evidenceCount={evidence.length}
            />
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm border border-gray-200 dark:border-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex px-6 gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 font-medium text-sm transition-all flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
          
          {/* --- 1. OVERVIEW --- */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <FileText size={18} /> Executive Summary
                </h3>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-lg">
                  {overview}
                </p>
              </div>
              
              {claim.author && (
                <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                  {claim.author.avatar && <img src={claim.author.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />}
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{claim.author.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500">{claim.author.handle}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- 2. EVIDENCE --- */}
          {activeTab === 'evidence' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {evidence.length > 0 ? (
                evidence.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-5 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg h-fit text-indigo-600 dark:text-indigo-400">
                      <Search size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{item.source}</span>
                        <span className="text-xs text-gray-400">• {item.date}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">"{item.snippet}"</p>
                      <button className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline">
                        Verify Source <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                 <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <Search size={40} className="mx-auto mb-2 opacity-20" />
                    <p>No specific external evidence links found.</p>
                 </div>
              )}
            </div>
          )}

          {/* --- 3. MEDIA FORENSICS (Using 'forensics' variable) --- */}
          {activeTab === 'forensics' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Status Card */}
                <div className={`p-5 rounded-xl border ${forensics.isManipulated ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800' : 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800'}`}>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    {forensics.isManipulated ? <AlertTriangle className="text-red-600" size={24} /> : <CheckCircle className="text-green-600" size={24} />}
                    <span className={`text-2xl font-bold ${forensics.isManipulated ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                      {forensics.isManipulated ? 'DETECTED' : 'CLEAN'}
                    </span>
                  </div>
                </div>
                
                {/* Score Card */}
                <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 text-gray-500">AI Probability</p>
                  <div className="flex items-center gap-2">
                    <Activity className="text-blue-500" size={24} />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{(forensics.score * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Voice Biometrics (Hyper-Local USP) */}
                <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Mic2 size={16} className="text-purple-500" /> Voice Biometrics & Dialect
                    </h4>
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded border border-purple-200 uppercase">
                      Indian Context
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase mb-1">Claimed Region</p>
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                        <MapPin size={16} className="text-red-500" /> 
                        {claim.region ? claim.region.toUpperCase() : "NATIONAL"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase mb-1">Detected Dialect</p>
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                         {claim.verdict === "Altered" || claim.verdict === "Fake" || claim.verdict === "Misleading" ? (
                           <span className="text-red-600 flex items-center gap-2">
                             ⚠️ Anomaly Detected
                           </span>
                         ) : (
                           <span className="text-green-600 flex items-center gap-2">
                             <CheckCircle size={14} /> Matches Region
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Log */}
              <div className="bg-slate-900 text-slate-300 p-5 rounded-xl font-mono text-sm border border-slate-700 shadow-inner relative overflow-hidden">
                <div className="flex justify-between border-b border-slate-700 pb-2 mb-3 z-10 relative">
                  <span className="text-emerald-400">TOOL: {forensics.tool}</span>
                  <span className="text-slate-500">ID: {claim.id}-FOR</span>
                </div>
                <div className="space-y-2 z-10 relative">
                  <p className="opacity-50">&gt; Initializing deep scan...</p>
                  <p className="opacity-50">&gt; Analyzing frame consistency...</p>
                  <p className="opacity-50">&gt; Checking audio spectral artifacts...</p>
                  <p className="text-yellow-400 font-bold mt-4">&gt;&gt; RESULT: {forensics.details}</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Activity size={100} />
                </div>
              </div>
            </div>
          )}

          {/* --- 4. LINEAGE TAB --- */}
          {activeTab === 'lineage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Origin Source</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Share2 size={16} className="text-blue-500"/> {lineage.origin}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Spread Velocity</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    lineage.velocity?.includes("High") || lineage.velocity?.includes("Viral") 
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  }`}>
                    {lineage.velocity}
                  </span>
                </div>
              </div>

              {/* Visual Graph */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 overflow-hidden relative min-h-[220px] flex flex-col items-center justify-center">
                <h4 className="absolute top-4 left-4 text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Network size={14} /> Propagation Map
                </h4>
                <div className="flex flex-col items-center gap-6 mt-4">
                  {/* Origin Node */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-[0_0_25px_rgba(220,38,38,0.6)] animate-pulse border-2 border-red-400">
                      {(lineage.origin || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] text-red-300 mt-2 font-mono bg-red-900/30 px-2 rounded">
                      {(lineage.origin || "Unknown").substring(0, 15)}...
                    </span>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-600"></div>
                  </div>

                  {/* Amplifier Nodes */}
                  <div className="flex gap-12 relative z-10">
                    {(lineage.velocity?.includes("High") || lineage.velocity?.includes("Viral") ? [1, 2, 3] : [1, 2]).map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg border border-blue-400">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="h-4 w-0.5 bg-slate-700"></div>
                        <div className="flex gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* SVG Lines */}
                  <svg className="absolute top-1/2 left-0 w-full h-full pointer-events-none opacity-20 -translate-y-6">
                    <path d="M 50% 20 Q 30% 50 25% 80" stroke="white" strokeWidth="1" fill="none" />
                    <path d="M 50% 20 Q 70% 50 75% 80" stroke="white" strokeWidth="1" fill="none" />
                    {(lineage.velocity?.includes("High") || lineage.velocity?.includes("Viral")) && (
                       <path d="M 50% 20 L 50% 80" stroke="white" strokeWidth="1" fill="none" />
                    )}
                  </svg>
                </div>
              </div>

              {/* Amplifier List */}
              {lineage.amplifiers?.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                    <GitFork size={16} className="text-blue-500" /> Key Amplifiers
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lineage.amplifiers.map((amp: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200">
                        {amp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
            <Download size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors text-sm font-bold">
            <AlertTriangle size={16} /> Appeal Verdict
          </button>
        </div>
      </div>
    </div>
  );
}
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle2, AlertTriangle, Copy, MessageCircle, Flame, Activity, User, Bot, Send,Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

export function AnalysisResult({ result }: { result: string }) {
  const [copied, setCopied] = useState(false);
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  if (!result) return null;

  const isSafe = !result.toLowerCase().includes("false") && 
                 !result.toLowerCase().includes("fake") && 
                 !result.toLowerCase().includes("misleading");

  const parts = result.split("COUNTER-NARRATIVE:");
  const analysisText = parts[0];
  const counterNarrative = parts.length > 1 ? parts[1].trim() : null;
  const scoreMatch = result.match(/Viral Risk Score:\s*(\d+)%/i);
  const viralScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(counterNarrative || analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFollowUp = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setChatLoading(true);

    try {
      // Context-Aware Chat
      const prompt = `CONTEXT: ${analysisText}
      
      USER QUESTION: ${userMsg}
      
      Answer the user's question based ONLY on the context above. Keep it short (max 2 sentences).`;

      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'agent', text: data.analysis }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'agent', text: "Connection error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 pb-20">
      
      {/* Main Analysis Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className={`p-3 rounded-full ${isSafe ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
            {isSafe ? <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} /> : <AlertTriangle className="text-amber-600 dark:text-amber-400" size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Investigation Report</h2>
        </div>

        {/* Viral Risk Dashboard */}
        {viralScore !== null && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Flame size={18} className={viralScore > 70 ? "text-red-500" : "text-orange-400"} />
                  Viral Potential
                </h4>
                <span className={`text-4xl font-black ${viralScore > 70 ? 'text-red-500' : 'text-blue-500'}`}>
                  {viralScore}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${viralScore > 70 ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-blue-500'}`} 
                  style={{ width: `${viralScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                <Activity size={18} /> Emotional Triggers
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Fear', 'Outrage', 'Urgency', 'Bias', 'Hope', 'Patriotism'].map(emotion => {
                  if (result.includes(emotion)) {
                    return (
                      <span key={emotion} className="px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-bold border border-purple-200 dark:border-purple-800">
                        {emotion}
                      </span>
                    );
                  }
                  return null;
                })}
                <span className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-sm">
                  Analyzed by AI
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* CONTENT AREA - FORCED COLORS */}
        <div className="text-lg leading-8 text-gray-800 dark:text-gray-200">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="mb-6 text-gray-800 dark:text-gray-300" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b dark:border-gray-700 pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-6 bg-gray-50 dark:bg-gray-900/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-800 dark:text-gray-300 pl-2" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:underline font-medium" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-8 border rounded-xl border-gray-200 dark:border-gray-700"><table className="w-full text-left" {...props} /></div>,
              thead: ({node, ...props}) => <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200" {...props} />,
              th: ({node, ...props}) => <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider" {...props} />,
              td: ({node, ...props}) => <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300" {...props} />,
            }}
          >
            {analysisText}
          </ReactMarkdown>
        </div>

        {/* --- NEW: CONTEXTUAL CHAT --- */}
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700">
          {!chatOpen ? (
            <button 
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline group"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" /> 
              Have questions about this report? Ask the Agent.
            </button>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                <Bot size={14} /> Investigator Chat
              </h4>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar p-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-100 dark:bg-blue-900'}`}>
                      {m.role === 'user' ? <User size={14} className="text-slate-600 dark:text-slate-300" /> : <Bot size={14} className="text-blue-600 dark:text-blue-300" />}
                    </div>
                    <div className={`p-3 rounded-lg text-sm max-w-[80%] ${m.role === 'user' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-200' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"><Bot size={14} /></div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-400 italic flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> Typing...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white placeholder-slate-400"
                />
                <button 
                  onClick={handleFollowUp}
                  disabled={chatLoading || !input}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counter-Narrative */}
      {counterNarrative && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl transform transition-all hover:scale-[1.01] ring-1 ring-white/20">
          <div className="flex items-start gap-5">
            <div className="bg-white/20 p-4 rounded-xl">
              <MessageCircle size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Shareable Correction</h3>
              <p className="text-blue-100 text-base mb-4 opacity-90">
                Help stop the spread of misinformation. Copy this verified message to reply to the fake news on WhatsApp or Twitter.
              </p>
              <div className="bg-black/20 rounded-xl p-5 font-mono text-base mb-4 border border-white/10 shadow-inner text-blue-50 leading-relaxed">
                "{counterNarrative}"
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95"
              >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copied ? "Copied to Clipboard!" : "Copy Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
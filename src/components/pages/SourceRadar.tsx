import { useState } from 'react';
import { Radar, Search, ShieldCheck, ShieldAlert, Globe, Loader2 } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';
import ReactMarkdown from 'react-markdown';

export function SourceRadar() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);

  const handleScan = async () => {
    if (!domain) return;
    setLoading(true);
    setResult(null);
    setThoughts([]);

    const prompt = `Analyze the source credibility and political bias of the domain: "${domain}". 
    Provide a 'Bias Rating' (Left/Center/Right), 'Factual Reporting Score' (High/Mixed/Low), and a summary of its reputation.`;

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt })
      });
      const data = await res.json();
      setResult(data.analysis);
      setThoughts(data.thoughts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-black rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20"><Radar size={140} /></div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Radar className="text-cyan-400" /> Source Bias Radar
        </h1>
        <p className="text-slate-300 max-w-xl text-lg">
          Before you trust a link, check the source. We analyze domain reputation, ownership, and historical bias.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl flex gap-2">
        <div className="flex items-center pl-4 text-slate-400"><Globe size={20} /></div>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain (e.g., news-daily.com)"
          className="flex-1 bg-transparent px-2 py-4 text-lg outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          Scan Source
        </button>
      </div>

      {/* Thinking Process */}
      {(loading || thoughts.length > 0) && (
        <ThinkingProcess thoughts={thoughts} loading={loading} />
      )}

      {/* Result */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            {result.toLowerCase().includes("low") || result.toLowerCase().includes("mixed") ? (
              <ShieldAlert className="text-red-500" size={32} />
            ) : (
              <ShieldCheck className="text-green-500" size={32} />
            )}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Source Intelligence Report</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
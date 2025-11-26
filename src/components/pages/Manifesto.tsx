import { useState } from 'react';
import { Scale, BookOpen, Loader2 } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';
import { AnalysisResult } from '../ui/AnalysisResult'; // Import the new result UI

const TOPICS = [
  { id: 'jobs', label: 'Employment & Jobs', icon: '💼' },
  { id: 'health', label: 'Healthcare Promises', icon: '🏥' },
  { id: 'women', label: 'Women Safety & Rights', icon: '👩' },
  { id: 'infra', label: 'Infrastructure', icon: '🏗️' },
];

export function Manifesto() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);

  const handleCompare = async (topicLabel: string) => {
    setLoading(true);
    setAnalysis(null);
    setThoughts([]);
    
    const prompt = `Research the 2025 election manifestos of the major opposing parties regarding '${topicLabel}'. 
    Create a structured comparison summary. 
    Format the comparison as a Markdown Table if possible.`; // Instruct Agent to give a table

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt })
      });
      
      const data = await res.json();
      setAnalysis(data.analysis);
      setThoughts(data.thoughts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Scale size={120} /></div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="text-indigo-400" /> Manifesto Watch
        </h1>
        <p className="text-indigo-200 max-w-xl text-lg">
          Our AI Agent reads 500+ page manifestos to compare promises side-by-side.
        </p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => { setSelectedTopic(topic.id); handleCompare(topic.label); }}
            disabled={loading}
            className={`p-6 rounded-xl border text-left transition-all group relative overflow-hidden
              ${selectedTopic === topic.id 
                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 dark:bg-indigo-900/30' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
          >
            <span className="text-3xl mb-3 block">{topic.icon}</span>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{topic.label}</h3>
            <p className="text-xs text-slate-500">Click to compare</p>
            {loading && selectedTopic === topic.id && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Thinking Process */}
      {(loading || thoughts.length > 0) && (
        <ThinkingProcess thoughts={thoughts} loading={loading} />
      )}

      {/* Result Area (Replaced with new component) */}
      {analysis && <AnalysisResult result={analysis} />}
    </div>
  );
}
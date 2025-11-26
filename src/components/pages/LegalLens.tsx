import { useState } from 'react';
import { Scale, FileText, Download, Loader2, Gavel } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';
import ReactMarkdown from 'react-markdown';

export function LegalLens() {
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);

  const handleDraft = async () => {
    if (!details) return;
    setLoading(true);
    setResult(null);
    setThoughts([]);

    const prompt = `Draft a formal Legal Complaint to the Cyber Crime Cell of India regarding this incident: "${details}". 
    Cite specific sections of the IT Act 2000 (e.g., 66D, 66E, 67). 
    Format it as a professional letter.`;

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt })
      });
      const data = await res.json();
      setResult(data.analysis);
      setThoughts(data.thoughts || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-6 pb-12">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20"><Scale size={140} /></div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Gavel className="text-yellow-400" /> Legal Lens
        </h1>
        <p className="text-slate-300 max-w-xl text-lg">
          Don't just report it. Sue them. Generate instant legal drafts for Deepfake or Hate Speech complaints.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          Incident Details (URL, Victim Name, Description)
        </label>
        <textarea 
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="e.g., 'I found a deepfake video of myself on [URL]. My name is [Name]. It was posted by user [Handle]...'"
          className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none transition text-slate-800 dark:text-white"
        />
        <button 
          onClick={handleDraft}
          disabled={loading || !details}
          className="mt-4 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 w-full justify-center transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <FileText />}
          Draft Legal Complaint
        </button>
      </div>

      {(loading || thoughts.length > 0) && <ThinkingProcess thoughts={thoughts} loading={loading} />}

      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Draft Complaint</h2>
              <button className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-bold">
                <Download size={16} /> Download PDF
              </button>
           </div>
           <div className="prose prose-lg max-w-none text-slate-800 dark:text-slate-300 font-serif leading-relaxed whitespace-pre-wrap">
             <ReactMarkdown>{result}</ReactMarkdown>
           </div>
        </div>
      )}
    </div>
  );
}
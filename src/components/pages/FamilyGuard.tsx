import { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, Copy, Languages, Loader2 } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';

export function FamilyGuard() {
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);

  const handleGenerate = async () => {
    if (!message) return;
    setLoading(true);
    setResult(null);
    setThoughts([]);

    const prompt = `Verify this forwarded message: "${message}". 
    Then, write a polite, respectful reply in ${language} that I can send to my family group to correct them without being rude. 
    Also provide the English translation of the reply.`;

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
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><MessageCircle size={140} /></div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <MessageCircle className="text-green-200" /> WhatsApp Family Guard
        </h1>
        <p className="text-green-100 max-w-xl text-lg">
          Paste that forwarded message from "Uncle Ji." We'll check it and write a polite correction for you.
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          Paste Forwarded Message
        </label>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g., 'NASA just announced that the sun will turn blue tomorrow...'"
          className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-green-500 outline-none transition text-slate-800 dark:text-white"
        />
        
        <div className="flex flex-wrap gap-4 mt-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="text-slate-400" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 font-medium outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !message}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            Generate Reply
          </button>
        </div>
      </div>

      {/* Live Thinking */}
      {(loading || thoughts.length > 0) && (
        <ThinkingProcess thoughts={thoughts} loading={loading} />
      )}

      {/* Result */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-green-200 dark:border-green-900/30 shadow-sm overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 border-b border-green-100 dark:border-green-800/30 flex items-center gap-3">
            <CheckCircle2 className="text-green-600 dark:text-green-400" />
            <h3 className="font-bold text-green-900 dark:text-green-100">Ready to Send</h3>
          </div>
          <div className="p-8">
             {/* WhatsApp Bubble Style */}
             <div className="bg-[#dcf8c6] dark:bg-[#005c4b] text-slate-900 dark:text-white p-4 rounded-lg rounded-tl-none inline-block max-w-2xl shadow-sm relative">
                <p className="whitespace-pre-wrap leading-relaxed text-lg">{result}</p>
                <div className="absolute top-0 left-0 -ml-2 w-0 h-0 border-t-[10px] border-t-[#dcf8c6] dark:border-t-[#005c4b] border-l-[10px] border-l-transparent"></div>
             </div>

             <div className="mt-6 flex gap-4">
               <button 
                 onClick={() => navigator.clipboard.writeText(result)}
                 className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors font-medium"
               >
                 <Copy size={18} /> Copy Text
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useRef } from 'react';
import { ShieldAlert, Scan, Lock, AlertOctagon, PhoneOff, Upload, X, Image as ImageIcon } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';
import ReactMarkdown from 'react-markdown';

export function CyberSentry() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null); // Base64 Image
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Convert to Base64
      };
      reader.readAsDataURL(file);
    }
  };

 const handleScan = async () => {
    // Allow scan if EITHER input OR image is present
    if (!input && !image) return;
    
    setLoading(true);
    setResult(null);
    setThoughts([]);

    // AUTO-GENERATE PROMPT if user didn't type anything
    let promptText = input;
    if (!promptText && image) {
      promptText = "Analyze this uploaded screenshot for signs of a scam, fraud, or fake notice.";
    }

    const prompt = `Analyze this potential scam context: "${promptText}". 
    Provide a SCAM PROBABILITY, identify the SCAM TYPE, and list IMMEDIATE ACTIONS.`;

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: prompt,
          image_data: image // <--- SEND THE IMAGE DATA
        })
      });
      const data = await res.json();
      setResult(data.analysis);
      setThoughts(data.thoughts || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-6 pb-12">
      <div className="bg-gradient-to-r from-red-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20"><ShieldAlert size={140} /></div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Lock className="text-red-400" /> Cyber-Sentry
        </h1>
        <p className="text-red-100 max-w-xl text-lg">
          Digital Arrest Protection. Upload screenshots of suspicious notices or paste threatening messages here.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm">
        
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            Paste Suspicious Text / Call Transcript
          </label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: 'This is CBI. You are under digital arrest...'"
            className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-red-500 outline-none transition text-slate-800 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            Upload Screenshot (Optional)
          </label>
          
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-red-500 transition-colors" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload a screenshot of the scam message</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          ) : (
            <div className="relative inline-block">
              <img src={image} alt="Upload Preview" className="h-40 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md" />
              <button 
                onClick={() => { setImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm"
              >
                <X size={14} />
              </button>
              <p className="mt-2 text-xs text-center text-green-600 font-bold flex items-center justify-center gap-1">
                <ImageIcon size={12} /> Image Ready to Scan
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={handleScan}
          disabled={loading || (!input && !image)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 w-full justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
        >
          {loading ? <Scan className="animate-spin" /> : <AlertOctagon />}
          Scan for Fraud
        </button>
      </div>

      {(loading || thoughts.length > 0) && <ThinkingProcess thoughts={thoughts} loading={loading} />}

      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-lg p-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
               <PhoneOff className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Threat Analysis Report</h2>
          </div>
          <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
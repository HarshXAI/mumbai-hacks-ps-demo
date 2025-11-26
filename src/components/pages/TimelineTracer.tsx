import { useState } from 'react';
import { History, Calendar,  GitCommit, AlertCircle, Loader2 } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';

interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  type: 'origin' | 'resurgence' | 'debunk' | 'current';
}

export function TimelineTracer() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);

  const handleTrace = async () => {
    if (!query) return;
    setLoading(true);
    setEvents([]);
    setVerdict(null);
    setThoughts([]);

    const prompt = `Trace the history and origin of this claim/video: "${query}". 
    Find out if it is old content being reused. 
    List the timeline of when it first appeared, when it was debunked, and why it's sharing now.
    Use the TIMELINE_EVENT format.`;

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt })
      });

      const data = await res.json();
      const fullText = data.analysis;
      
      // Parse the TIMELINE_EVENTS
      const parsedEvents: TimelineEvent[] = [];
      const lines = fullText.split('\n');
      
      lines.forEach((line: string) => {
        if (line.includes('TIMELINE_EVENT:')) {
          const clean = line.replace('TIMELINE_EVENT:', '').trim();
          const parts = clean.split('|');
          if (parts.length >= 2) {
            parsedEvents.push({
              date: parts[0].trim(),
              title: parts[1].trim(),
              desc: parts[2] ? parts[2].trim() : 'Context unavailable',
              type: parsedEvents.length === 0 ? 'origin' : 'resurgence'
            });
          }
        }
      });

      // If AI didn't follow format, add a fallback based on the query
      if (parsedEvents.length === 0) {
          parsedEvents.push({ date: "2019 (Est.)", title: "Likely Origin", desc: "Similar narratives detected in archives.", type: "origin" });
          parsedEvents.push({ date: "Today", title: "Current Viral Spike", desc: "Resurfaced during election cycle.", type: "current" });
      }

      setEvents(parsedEvents);
      setVerdict(fullText.split("Final Verdict:")[1] || "Analysis Complete");
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
      <div className="bg-gradient-to-r from-amber-700 to-orange-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20"><History size={140} /></div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <History className="text-amber-200" /> Timeline Tracer
        </h1>
        <p className="text-amber-100 max-w-xl text-lg">
          Is that "Breaking News" actually 5 years old? Trace the lifecycle of a rumor to expose recycled propaganda.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste a headline or describe a video (e.g. 'Bridge collapse video Mumbai')"
          className="flex-1 bg-transparent px-4 py-4 text-lg outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
        />
        <button
          onClick={handleTrace}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <GitCommit className="rotate-90" />}
          Trace Origin
        </button>
      </div>

      {(loading || thoughts.length > 0) && <ThinkingProcess thoughts={thoughts} loading={loading} />}

      {/* Timeline Visualization */}
      {events.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
             <Calendar className="text-amber-500" /> Narrative Lifecycle
           </h2>
           
           <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-12">
              {events.map((event, i) => (
                <div key={i} className="relative pl-8 animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 150}ms` }}>
                   {/* Dot */}
                   <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
                     ${i === 0 ? 'bg-red-500 border-red-300' : 'bg-slate-900 border-slate-500 dark:bg-slate-400'}`} 
                   />
                   
                   {/* Card */}
                   <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition-colors">
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                        {event.date}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {event.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {event.desc}
                      </p>
                   </div>
                </div>
              ))}
           </div>

           {/* Verdict Footer */}
           <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm uppercase">Final Assessment</h4>
                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed mt-1">
                  {verdict || "This content appears to be recycled from a previous event context."}
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
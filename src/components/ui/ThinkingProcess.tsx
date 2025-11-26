import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
export interface AgentThought {
  step: string;
  details: string;
}

interface ThinkingProcessProps {
  thoughts: AgentThought[];
  loading: boolean;
}

export function ThinkingProcess({ thoughts, loading }: ThinkingProcessProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default open while thinking

  if (thoughts.length === 0 && !loading) return null;

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-hidden transition-all">
      {/* Header / Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="animate-spin w-5 h-5" />
              <span className="font-medium text-sm animate-pulse">Analyzing sources...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium text-sm">Analysis Complete</span>
            </div>
          )}
          
          {!loading && (
            <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">
              {thoughts.length} Steps
            </span>
          )}
        </div>
        
        {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>

      {/* The Logs List */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="space-y-4 pt-4">
            {thoughts.map((t, i) => (
              <div key={i} className="relative pl-6 pb-2 border-l-2 border-slate-200 dark:border-slate-700 last:border-0">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${i === thoughts.length - 1 && loading 
                    ? 'border-blue-500 bg-blue-500 animate-pulse' 
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${i === thoughts.length - 1 && loading ? 'bg-white' : 'bg-slate-400'}`}></div>
                </div>

                {/* Content */}
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {t.step.replace("Action:", "").trim()}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    {t.details}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="pl-6 pt-2 flex items-center gap-2 text-slate-400 text-sm italic">
                <Sparkles size={14} className="animate-spin" />
                Agent is thinking...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
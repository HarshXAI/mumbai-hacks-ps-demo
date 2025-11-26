import  { useState, useEffect } from 'react';
import { TrendingUp, MapPin, Clock, RefreshCw, Loader2, ChevronUp } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const REGIONS = ['All Regions', 'National', 'Mumbai', 'Delhi', 'Maharashtra'];

// 1. INITIAL TRENDS
const INITIAL_TOPICS = [
  { id: 1, name: "EVM Tampering", posts: 12400, category: "Politics", trend: 'up' },
  { id: 2, name: "Deepfake Regulations", posts: 8200, category: "Tech Policy", trend: 'up' },
  { id: 3, name: "Maharashtra Elections", posts: 45100, category: "Election", trend: 'same' },
  { id: 4, name: "Student Loans", posts: 3200, category: "Economy", trend: 'down' },
  { id: 5, name: "Vote Jihad", posts: 1500, category: "Viral", trend: 'up' }
];

// 2. RESERVE POOL (New topics that will swap in)
const RESERVE_TOPICS = [
  { id: 6, name: "Manipur Violence", posts: 28000, category: "Conflict", trend: 'up' },
  { id: 7, name: "Farmer Protest 2.0", posts: 19000, category: "Protest", trend: 'up' },
  { id: 8, name: "Sensex Crash", posts: 5600, category: "Finance", trend: 'down' },
  { id: 9, name: "New Education Policy", posts: 11200, category: "Education", trend: 'same' },
  { id: 10, name: "Railway Safety", posts: 4100, category: "National", trend: 'up' }
];

export function RightRail() {
  const { state, dispatch } = useAppContext();
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [loading, setLoading] = useState(false);

  // --- LIVE SIMULATION ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTopics(prev => {
        // 1. Randomly Shuffle/Swap Logic (10% chance to swap bottom topic with a new one)
        let newTopics = [...prev];
        if (Math.random() > 0.9) {
          const randomReserve = RESERVE_TOPICS[Math.floor(Math.random() * RESERVE_TOPICS.length)];
          // Replace the last item to simulate "Breaking News" climbing up
          newTopics[newTopics.length - 1] = { ...randomReserve, posts: 5000 + Math.floor(Math.random() * 1000) };
        }

        // 2. Update Counts & Re-sort
        const updated = newTopics.map(t => {
            const growth = Math.floor(Math.random() * 500); // Big jumps for visibility
            return {
                ...t,
                posts: t.posts + growth,
                trend: growth > 250 ? 'up' : 'same'
            };
        });

        // 3. Sort by posts (Descending)
        return updated.sort((a, b) => b.posts - a.posts).slice(0, 5);
      });
    }, 1500); // Updates every 1.5s (Very Fast & Visible)

    return () => clearInterval(interval);
  }, []);

  const formatCount = (num: number) => {
    return num > 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Reset to a shuffled mix
      const mix = [...INITIAL_TOPICS, ...RESERVE_TOPICS].sort(() => 0.5 - Math.random()).slice(0, 5);
      setTopics(mix.sort((a, b) => b.posts - a.posts));
      setLoading(false);
    }, 800);
  };

  return (
    // FIX: Added 'overflow-y-auto' and removed fixed heights to prevent overlap
    <aside className="w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 hidden lg:flex flex-col h-full overflow-y-auto p-6 transition-colors duration-300">
      
      {/* 1. LIVE TRENDS SECTION */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={20} /> Trending Now
          </h3>
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE</span>
              </div>
              <button onClick={handleRefresh} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition">
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
          </div>
        </div>

        {/* Dynamic List */}
        <div className="space-y-3">
          {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                  <Loader2 className="animate-spin" />
                  <span className="text-xs">Syncing global trends...</span>
              </div>
          ) : (
              topics.map((topic, index) => (
              <div 
                  key={`${topic.id}-${index}`} // Unique key forces animation on re-order
                  className="group cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 animate-in slide-in-from-right-2 fade-in"
              >
                  <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">{topic.category}</p>
                        <span className="text-gray-900 dark:text-slate-200 font-bold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block mb-1">
                          #{topic.name.replace(/\s/g, '')}
                        </span>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">
                             {formatCount(topic.posts)} posts
                          </p>
                          {/* Trend Indicator */}
                          {topic.trend === 'up' && <span className="text-[10px] text-green-500 flex items-center"><ChevronUp size={12}/> Rising</span>}
                        </div>
                    </div>
                    <span className={`text-xs font-bold ${index === 0 ? 'text-orange-500' : 'text-gray-400'} opacity-50`}>
                      #{index + 1}
                    </span>
                  </div>
              </div>
              ))
          )}
        </div>
      </div>

      {/* 2. REGION FILTER (Properly Spaced) */}
      <div className="mb-8 border-t border-gray-100 dark:border-slate-800 pt-6">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider opacity-90">
          <MapPin className="text-purple-500" size={16} /> Filter by Region
        </h3>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map(region => {
            const isSelected = region === 'All Regions' 
              ? state.filters.region === 'all' 
              : state.filters.region.toLowerCase() === region.toLowerCase();
            
            return (
              <button
                key={region}
                onClick={() => dispatch({ 
                  type: 'UPDATE_FILTERS', 
                  payload: { region: region === 'All Regions' ? 'all' : region.toLowerCase() } 
                })}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TIME WINDOW FILTER */}
      <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider opacity-90">
          <Clock className="text-orange-500" size={16} /> Time Window
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl border border-gray-200 dark:border-slate-800">
          {[
            { label: 'All Time', value: 'all' },
            { label: 'Last Hour', value: '1h' },
            { label: 'Last 24 Hours', value: '24h' },
            { label: 'Last 7 Days', value: '7d' }
          ].map((time) => {
            const isSelected = state.filters.timeWindow === time.value;
            return (
              <button 
                key={time.value} 
                onClick={() => dispatch({ 
                  type: 'UPDATE_FILTERS', 
                  payload: { timeWindow: time.value as any } 
                })}
                className={`flex items-center gap-3 cursor-pointer w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  isSelected ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-400 dark:border-slate-500'
                }`}></div>
                <span className={`text-xs font-medium ${
                  isSelected ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-slate-400'
                }`}>
                  {time.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
//import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
} from 'recharts';
import { AlertTriangle, CheckCircle, Activity, TrendingUp, Users, Globe, Zap } from 'lucide-react';

const TREND_DATA = [
  { time: '00:00', fake: 12, real: 45 },
  { time: '04:00', fake: 18, real: 30 },
  { time: '08:00', fake: 45, real: 80 },
  { time: '12:00', fake: 85, real: 60 },
  { time: '16:00', fake: 60, real: 90 },
  { time: '20:00', fake: 30, real: 110 },
  { time: '23:59', fake: 20, real: 50 },
];

const SOURCE_DATA = [
  { name: 'WhatsApp', value: 45, color: '#22c55e' },
  { name: 'Twitter/X', value: 30, color: '#3b82f6' },
  { name: 'Facebook', value: 15, color: '#6366f1' },
  { name: 'YouTube', value: 10, color: '#ef4444' },
];

const REGION_DATA = [
  { name: 'MH', risk: 85 },
  { name: 'DL', risk: 65 },
  { name: 'UP', risk: 45 },
  { name: 'KA', risk: 30 },
];

// Helper Component for Stats
function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <div className={`p-2 ${bg} rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
      <p className={`${color} text-xs font-bold mt-1`}>{sub}</p>
    </div>
  );
}

export function TrustDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="text-blue-600" /> Trust Dashboard
          </h1>
          <p className="text-gray-500 dark:text-slate-400">Live monitoring of information warfare vectors.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <span className="text-xs font-bold text-red-700 dark:text-red-300 tracking-wider">THREAT LEVEL: HIGH</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Narratives" value="12" sub="+3 this hour" icon={Zap} color="text-yellow-500" bg="bg-yellow-100 dark:bg-yellow-900/20" />
        <StatCard label="Misinformation Detected" value="3,208" sub="25.7% of traffic" icon={AlertTriangle} color="text-red-500" bg="bg-red-100 dark:bg-red-900/20" />
        <StatCard label="Verified Truths" value="9,104" sub="System Healthy" icon={CheckCircle} color="text-green-500" bg="bg-green-100 dark:bg-green-900/20" />
        <StatCard label="Sources Monitored" value="12.4M" sub="Real-time stream" icon={Globe} color="text-blue-500" bg="bg-blue-100 dark:bg-blue-900/20" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={18} /> 24h Narrative Volume
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFake)" name="Disinformation" />
                <Area type="monotone" dataKey="real" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" name="Verified News" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="text-purple-500" size={18} /> Top Vectors
          </h3>
          <div className="h-[200px] w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={SOURCE_DATA}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {SOURCE_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: 'white' }} />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                 <span className="text-3xl font-black text-gray-900 dark:text-white">45%</span>
                 <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">WhatsApp</p>
               </div>
             </div>
          </div>
          <div className="mt-6 space-y-3">
             {SOURCE_DATA.map(source => (
               <div key={source.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                   <span className="text-gray-600 dark:text-slate-300 font-medium">{source.name}</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">{source.value}%</span>
               </div>
             ))}
          </div>
        </div>

      </div>

      {/* Regional Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {REGION_DATA.map(region => (
           <div key={region.name} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-end mb-2">
               <span className="text-gray-500 dark:text-slate-400 font-bold uppercase text-xs">{region.name}</span>
               <span className={`text-2xl font-black ${region.risk > 70 ? 'text-red-500' : 'text-yellow-500'}`}>{region.risk}</span>
             </div>
             <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
               <div 
                 className={`h-2 rounded-full ${region.risk > 70 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                 style={{ width: `${region.risk}%` }}
               ></div>
             </div>
             <p className="text-xs text-gray-400 mt-2 text-right">Risk Score</p>
           </div>
         ))}
      </div>

    </div>
  );
}
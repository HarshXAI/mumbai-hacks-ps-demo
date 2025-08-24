import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

export function Dashboard() {
  const kpis = [
    { 
      label: 'Total Flagged', 
      value: '2,847', 
      change: '+12%', 
      trend: 'up',
      icon: AlertTriangle
    },
    { 
      label: '% Misleading', 
      value: '23.4%', 
      change: '-2.1%', 
      trend: 'down',
      icon: TrendingDown
    },
    { 
      label: 'Median Trust Score', 
      value: '67', 
      change: '+5.2%', 
      trend: 'up',
      icon: TrendingUp
    },
    { 
      label: 'Avg Verification Latency', 
      value: '4.2h', 
      change: '-0.8h', 
      trend: 'down',
      icon: Clock
    },
  ];

  const trustScoreData = [
    { range: '0-20', count: 45 },
    { range: '21-40', count: 123 },
    { range: '41-60', count: 267 },
    { range: '61-80', count: 398 },
    { range: '81-100', count: 189 },
  ];

  const trendData = [
    { date: 'Oct 10', flagged: 234, avgScore: 65 },
    { date: 'Oct 11', flagged: 267, avgScore: 63 },
    { date: 'Oct 12', flagged: 298, avgScore: 68 },
    { date: 'Oct 13', flagged: 312, avgScore: 66 },
    { date: 'Oct 14', flagged: 289, avgScore: 69 },
    { date: 'Oct 15', flagged: 334, avgScore: 67 },
    { date: 'Oct 16', flagged: 356, avgScore: 71 },
  ];

  const topSources = [
    { source: '@newsaccount', flagged: 45, avgScore: 78, change: '+5' },
    { source: '@politicalwatch', flagged: 38, avgScore: 65, change: '-2' },
    { source: '@breakingnews24', flagged: 32, avgScore: 72, change: '+8' },
    { source: '@localupdates', flagged: 28, avgScore: 69, change: '+3' },
    { source: '@socialmedia_x', flagged: 25, avgScore: 58, change: '-1' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trust Dashboard</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className={`text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trust Score Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trust Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trustScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="flagged" stroke="#ef4444" name="Items Flagged" />
              <Line type="monotone" dataKey="avgScore" stroke="#10b981" name="Avg Trust Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Sources Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Sources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source/Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items Flagged
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Trust Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Change (7d)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topSources.map((source, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{source.source}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{source.flagged}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{source.avgScore}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${
                      source.change.startsWith('+') 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {source.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                      View items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
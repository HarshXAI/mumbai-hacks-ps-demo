import React from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function RightRail() {
  const { state, dispatch } = useAppContext();

  const trendingTopics = [
    'Student Loans', 'Rally Crowds', 'Tax Policy', 'Healthcare Reform',
    'Infrastructure', 'Climate Action', 'Education Budget'
  ];

  const regions = [
    'National', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'
  ];

  const timeWindows = [
    { value: '1h', label: 'Last 1h' },
    { value: '24h', label: 'Last 24h' },
    { value: '7d', label: 'Last 7d' }
  ];

  if (state.rightRailCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_RIGHT_RAIL' })}
          className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Expand right rail"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_RIGHT_RAIL' })}
          className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Collapse right rail"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Trending Topics */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Trending Topics</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Regions</h4>
          </div>
          <select 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={state.filters.region}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_FILTERS', 
              payload: { region: e.target.value } 
            })}
          >
            <option value="all">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Time Window */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Time Window</h4>
          </div>
          <div className="space-y-2">
            {timeWindows.map((window) => (
              <label key={window.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="timeWindow"
                  value={window.value}
                  checked={state.filters.timeWindow === window.value}
                  onChange={(e) => dispatch({ 
                    type: 'UPDATE_FILTERS', 
                    payload: { timeWindow: e.target.value as '1h' | '24h' | '7d' } 
                  })}
                  className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{window.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Home, BarChart3, Upload, Bell, Settings } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

export function LeftNav() {
  const { state, dispatch } = useAppContext();

  const navItems = [
    { id: 'feed', icon: Home, label: t('feed', state.language) },
    { id: 'dashboard', icon: BarChart3, label: t('trustDashboard', state.language) },
    { id: 'submissions', icon: Upload, label: t('mySubmissions', state.language) },
    { id: 'alerts', icon: Bell, label: t('alerts', state.language) },
    { id: 'settings', icon: Settings, label: t('settings', state.language) },
  ];

  return (
    <nav className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: item.id })}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors ${
                    state.currentPage === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
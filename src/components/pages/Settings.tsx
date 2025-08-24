import React from 'react';
import { User, Bell, Globe, Shield, FileText, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function Settings() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[
              { id: 'email_alerts', label: 'Email alerts for flagged content', defaultChecked: true },
              { id: 'push_notifications', label: 'Push notifications for urgent items', defaultChecked: true },
              { id: 'weekly_digest', label: 'Weekly digest of trending misinformation', defaultChecked: false },
              { id: 'submission_updates', label: 'Updates on my submissions', defaultChecked: true },
            ].map((item) => (
              <label key={item.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="text-blue-600 dark:text-blue-400 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Language & Region</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Language
              </label>
              <select
                value={state.language}
                onChange={(e) => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Region
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>National</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transparency</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">v2.1</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Model Version</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Oct 15</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Audit</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">98.7%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Data & Privacy</h4>
            <div className="space-y-2">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Data Usage Guidelines', href: '#' },
                { label: 'Transparency Report', href: '#' },
                { label: 'Methodology Documentation', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{link.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
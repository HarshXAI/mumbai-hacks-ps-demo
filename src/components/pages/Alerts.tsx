import React, { useState } from 'react';
import { Plus, Trash2, ToggleLeft as Toggle } from 'lucide-react';

export function Alerts() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    region: '',
    verdicts: [] as string[],
    notificationMethod: 'email'
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      name: 'Student Loan Misleading Claims',
      conditions: 'Topic contains "student loan" AND Verdict = Misleading',
      enabled: true,
      notificationMethod: 'email',
      created: '2 days ago'
    },
    {
      id: 2,
      name: 'Maharashtra Election Content',
      conditions: 'Region = Maharashtra AND Verdict ∈ {Misleading, Altered}',
      enabled: true,
      notificationMethod: 'push',
      created: '1 week ago'
    },
    {
      id: 3,
      name: 'Health Policy Misinformation',
      conditions: 'Topic contains "health policy" AND Verdict = Misleading',
      enabled: false,
      notificationMethod: 'email',
      created: '2 weeks ago'
    }
  ]);

  const verdictOptions = ['Unverified', 'Accurate', 'Misleading', 'Out of Context', 'Altered'];
  const regions = ['National', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now(),
      name: `${formData.topic} Alert`,
      conditions: `Topic contains "${formData.topic}" AND Region = ${formData.region} AND Verdict ∈ {${formData.verdicts.join(', ')}}`,
      enabled: true,
      notificationMethod: formData.notificationMethod,
      created: 'Just now'
    };
    setAlerts([newAlert, ...alerts]);
    setFormData({ topic: '', region: '', verdicts: [], notificationMethod: 'email' });
    setShowForm(false);
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleVerdictChange = (verdict: string) => {
    const current = formData.verdicts;
    const updated = current.includes(verdict)
      ? current.filter(v => v !== verdict)
      : [...current, verdict];
    setFormData({ ...formData, verdicts: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Alert Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Alert</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic Keywords
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., student loans, healthcare, election"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Region
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verdict Types (select at least one)
              </label>
              <div className="space-y-2">
                {verdictOptions.map(verdict => (
                  <label key={verdict} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.verdicts.includes(verdict)}
                      onChange={() => handleVerdictChange(verdict)}
                      className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{verdict}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="email"
                    checked={formData.notificationMethod === 'email'}
                    onChange={(e) => setFormData({ ...formData, notificationMethod: e.target.value })}
                    className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="push"
                    checked={formData.notificationMethod === 'push'}
                    onChange={(e) => setFormData({ ...formData, notificationMethod: e.target.value })}
                    className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Push Notification</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={formData.verdicts.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Create Alert
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Alerts</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{alert.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {alert.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{alert.conditions}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {alert.notificationMethod === 'email' ? 'Email' : 'Push'} • Created {alert.created}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      alert.enabled
                        ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Toggle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
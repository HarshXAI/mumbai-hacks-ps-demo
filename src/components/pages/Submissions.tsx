import React, { useState } from 'react';
import { Upload, Link as LinkIcon, FileText, Clock, CheckCircle } from 'lucide-react';

export function Submissions() {
  const [formData, setFormData] = useState({
    url: '',
    context: '',
    language: 'en',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const submissions = [
    {
      id: 1,
      type: 'URL',
      content: 'https://example.com/news-article',
      status: 'Verified',
      submittedAt: '2 hours ago',
      estimatedTime: 'Complete'
    },
    {
      id: 2,
      type: 'Image',
      content: 'political_rally_image.jpg',
      status: 'In Review',
      submittedAt: '1 day ago',
      estimatedTime: '2-4 hours'
    },
    {
      id: 3,
      type: 'URL',
      content: 'https://socialmedia.com/post/123',
      status: 'Received',
      submittedAt: '2 days ago',
      estimatedTime: '4-8 hours'
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setFormData({ url: '', context: '', language: 'en' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Received':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Review':
        return <Clock className="w-4 h-4" />;
      case 'Received':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Submissions</h1>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">Thanks!</p>
              <p className="text-green-700 dark:text-green-300 text-sm">We'll notify you when we have a verdict.</p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit for Verification</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL or Content Link
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/content-to-verify"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Upload (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Drop files here or <span className="text-blue-600 dark:text-blue-400">click to upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports: Image, Video, Audio files</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Context (Optional)
            </label>
            <textarea
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              placeholder="Provide additional context about why this content should be verified..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            Submit for Verification
          </button>
        </form>
      </div>

      {/* Submissions Queue */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submission Queue</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {submissions.map((submission) => (
            <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span className="ml-1">{submission.status}</span>
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{submission.submittedAt}</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{submission.content}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Estimated time: {submission.estimatedTime}
                  </p>
                </div>
                
                {submission.status === 'Verified' && (
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                    View Results
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
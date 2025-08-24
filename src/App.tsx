import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { LeftNav } from './components/layout/LeftNav';
import { RightRail } from './components/layout/RightRail';
import { Feed } from './components/pages/Feed';
import { Dashboard } from './components/pages/Dashboard';
import { Submissions } from './components/pages/Submissions';
import { Alerts } from './components/pages/Alerts';
import { Settings } from './components/pages/Settings';

function AppContent() {
  const { state } = useAppContext();

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'feed':
        return <Feed />;
      case 'dashboard':
        return <Dashboard />;
      case 'submissions':
        return <Submissions />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <LeftNav />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderCurrentPage()}
        </main>
        <RightRail />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
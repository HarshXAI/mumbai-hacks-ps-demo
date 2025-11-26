//import React from 'react';
import { 
  LayoutGrid, 
  Upload, 
  Bell, 
  Settings, 
  MessageCircle, 
  Radar, 
  BookOpen,
  History,
  GraduationCap,
  Lock,
  Mic,
  Scale,
  Search, 
  LayoutDashboard 
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { t } from '../../utils/translations';
export function LeftNav() {
  const { state, dispatch } = useAppContext();
  const navItems = [
    // 1. VERIFICATION TOOL (Renamed)
    { id: 'feed', label: 'Feed', icon: LayoutGrid },
    { id: 'intelligence', label: 'Trust Intelligence', icon: Search }, 
    
    // 2. FEED

    // 3. GRAPHS & STATS (The New Page)
   
    
    // --- PREVENTION TOOLS ---
    { id: 'family-guard', label: 'Family Guard', icon: MessageCircle },
    { id: 'source-radar', label: 'Source Radar', icon: Radar },
    
    // --- EDUCATION ---
    { id: 'manifesto', label: 'Manifesto Watch', icon: BookOpen },
    { id: 'academy', label: 'Truth Academy', icon: GraduationCap },
    // --- PROTECTION ---
    { id: 'timeline', label: 'Timeline Tracer', icon: History },
    { id: 'cyber-sentry', label: 'Cyber Sentry', icon: Lock },
    { id: 'truth-line', label: 'TruthLine (Voice Assisant)', icon: Mic },
    { id: 'legal-lens', label: 'Legal Lens', icon: Scale },
   // { id: 'sentinel', label: 'Sentinel (Live Monitor)', icon: Radio },
 { id: 'dashboard', label: 'Trust Dashboard', icon: LayoutDashboard }, 
    { id: 'submissions', label: t('mySubmissions', state.language), icon: Upload },
    { id: 'alerts', label: t('alerts', state.language), icon: Bell },
  ];

  const bottomItems = [
    { id: 'settings', label: t('settings', state.language), icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = state.currentPage === item.id;
    return (
      <button
        onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: item.id })}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
          }`}
      >
        <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white'} />
        <span className="font-medium text-sm">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col h-full py-6 px-3 hidden md:flex transition-colors duration-300">
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-2 mt-2">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Menu</p>
        </div>
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>
      <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
        {bottomItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>
    </aside>
  );
}
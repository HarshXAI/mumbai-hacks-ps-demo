import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';
export type Theme = 'light' | 'dark';
export type Verdict = 'Unverified' | 'Accurate' | 'Misleading' | 'Out of Context' | 'Altered';
export type MediaType = 'Text' | 'Video' | 'Image' | 'Screenshot' | 'Audio';

export interface Claim {
  id: string;
  title: string;
  verdict: Verdict;
  trustScore: number;
  confidence: number;
  evidenceCount: number;
  source: {
    handle: string;
    channel: string;
    timestamp: string;
    platform: string;
  };
  virality: number[];
  mediaType: MediaType;
  language: Language;
  region: string;
  summary?: string;
  evidence?: Array<{
    type: 'Official Record' | 'Prior Speech' | 'Article' | 'Press Note';
    title: string;
    timestamp: string;
    quote: string;
  }>;
  forensics?: {
    type: 'video' | 'image';
    frames?: string[];
    elaResults?: string[];
    audioSpoofScore?: number;
    transcriptDrift?: number[];
    metadata?: Record<string, any>;
  };
}

interface AppState {
  theme: Theme;
  language: Language;
  currentPage: string;
  rightRailCollapsed: boolean;
  claims: Claim[];
  selectedClaim: Claim | null;
  filters: {
    mediaType: MediaType[];
    verdict: Verdict[];
    language: Language[];
    region: string;
    timeWindow: '1h' | '24h' | '7d';
  };
}

type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'TOGGLE_RIGHT_RAIL' }
  | { type: 'SET_SELECTED_CLAIM'; payload: Claim | null }
  | { type: 'UPDATE_FILTERS'; payload: Partial<AppState['filters']> };

const initialState: AppState = {
  theme: 'light',
  language: 'en',
  currentPage: 'feed',
  rightRailCollapsed: false,
  claims: [],
  selectedClaim: null,
  filters: {
    mediaType: [],
    verdict: [],
    language: [],
    region: 'all',
    timeWindow: '24h',
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'TOGGLE_RIGHT_RAIL':
      return { ...state, rightRailCollapsed: !state.rightRailCollapsed };
    case 'SET_SELECTED_CLAIM':
      return { ...state, selectedClaim: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
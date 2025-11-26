import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// --- TYPES ---
export type Verdict = 'Accurate' | 'Misleading' | 'Out of Context' | 'Altered' | 'Unverified';
export type MediaType = 'Text' | 'Video' | 'Image' | 'Audio' | 'Screenshot';

export interface FilterState {
  mediaType: MediaType[];
  verdict: Verdict[];
  region: string;
  language: string[];
  timeWindow: 'all' | '1h' | '24h' | '7d'; // <--- ADDED THIS
}

export interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'hi' | 'mr';
  currentPage: string;
  selectedClaim: any | null;
  filters: FilterState;
  rightRailOpen: boolean;
}

// --- INITIAL STATE ---
const initialState: AppState = {
  theme: 'dark',
  language: 'en',
  currentPage: 'feed',
  selectedClaim: null,
  filters: {
    mediaType: [],
    verdict: [],
    region: 'all',
    language: [],
    timeWindow: 'all', // <--- DEFAULT
  },
  rightRailOpen: true,
};

// --- REDUCER ---
type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hi' | 'mr' }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'SET_SELECTED_CLAIM'; payload: any | null }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
  | { type: 'TOGGLE_RIGHT_RAIL' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SELECTED_CLAIM':
      return { ...state, selectedClaim: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'TOGGLE_RIGHT_RAIL':
      return { ...state, rightRailOpen: !state.rightRailOpen };
    default:
      return state;
  }
}

// --- PROVIDER ---
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);

"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type MainView = 'dashboard' | 'announcements' | 'events' | 'officers';
type SubView = 'create' | 'edit' | 'preview';

interface ViewState {
  main: MainView;
  sub?: SubView;
  params?: Record<string, any>;
}

interface NavigationContextType {
  currentView: ViewState;
  setView: (main: MainView, sub?: SubView, params?: Record<string, any>) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentView, setCurrentView] = useState<ViewState>({ main: 'dashboard' });
  const [history, setHistory] = useState<ViewState[]>([{ main: 'dashboard' }]);

  const setView = (main: MainView, sub?: SubView, params?: Record<string, any>) => {
    const newView: ViewState = { main, sub, params };
    setCurrentView(newView);
    setHistory(prev => [...prev, newView]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      const previous = newHistory[newHistory.length - 1];
      if (previous) {
        setCurrentView(previous);
      }
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        setView,
        goBack,
        canGoBack: history.length > 1,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

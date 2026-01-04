'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  path: string;
  isClosable: boolean;
}

// Store tabs in sessionStorage to persist across page navigations
const TABS_STORAGE_KEY = 'pt-software-tabs';

const loadTabsFromStorage = (initialPath: string): Tab[] => {
  if (typeof window === 'undefined') {
    return [{ id: 'tab-1', label: getTabLabel(initialPath), path: initialPath, isClosable: false }];
  }
  
  try {
    const stored = sessionStorage.getItem(TABS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  return [{ id: 'tab-1', label: getTabLabel(initialPath), path: initialPath, isClosable: false }];
};

const saveTabsToStorage = (tabs: Tab[]) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
  } catch (e) {
    // Ignore errors
  }
};

const getTabLabel = (path: string): string => {
  if (path === '/') return 'Dashboard';
  if (path.startsWith('/schedule')) return 'Schedule';
  if (path.startsWith('/patients/')) {
    const parts = path.split('/');
    if (parts.length > 2) {
      return 'Patient Chart';
    }
    return 'Patients';
  }
  if (path.startsWith('/patients')) return 'Patients';
  if (path.startsWith('/documents/')) return 'Document';
  if (path.startsWith('/documents')) return 'Documents';
  return 'New Tab';
};

export const BrowserTabs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  
  const [tabs, setTabs] = useState<Tab[]>(() => loadTabsFromStorage(pathname));
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || 'tab-1');

  // Save tabs to storage whenever they change
  useEffect(() => {
    saveTabsToStorage(tabs);
  }, [tabs]);

  // Update active tab's path when route changes (user navigated within the active tab)
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }

    setTabs(prev => {
      const activeTab = prev.find(t => t.id === activeTabId);
      if (activeTab) {
        return prev.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, path: pathname, label: getTabLabel(pathname) }
            : tab
        );
      }
      return prev;
    });
  }, [pathname, activeTabId]);

  // Find which tab should be active based on current path
  useEffect(() => {
    const matchingTab = tabs.find(t => t.path === pathname);
    if (matchingTab && matchingTab.id !== activeTabId) {
      setActiveTabId(matchingTab.id);
    }
  }, [pathname, tabs]);

  const handleTabClick = (tab: Tab) => {
    setActiveTabId(tab.id);
    isNavigatingRef.current = true;
    router.push(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1 || !tabs[tabIndex].isClosable) return;

    const tab = tabs[tabIndex];
    const newTabs = tabs.filter(t => t.id !== tabId);
    
    // If closing active tab, switch to adjacent tab
    if (tab.id === activeTabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)] || newTabs[0];
      if (newActiveTab) {
        router.push(newActiveTab.path);
      }
    }
    
    setTabs(newTabs);
  };

  const handleNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      label: 'Dashboard',
      path: '/',
      isClosable: true,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
    isNavigatingRef.current = true;
    router.push('/');
  };

  return (
    <div className="bg-gray-100 border-b border-cairos-border sticky top-0 z-50">
      <div className="max-w-full">
        <div className="flex items-end gap-1 px-4">
          <h1 className="text-body-lg font-semibold text-cairos-primary text-[120%] mr-4 mb-1.5 pt-2">
            PT Software
          </h1>
          <div className="flex gap-0.5 flex-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  type="button"
                  className={clsx(
                    'group relative flex items-center gap-2 px-4 py-2 text-body font-medium transition-all cursor-pointer',
                    'border-t border-l border-r border-gray-300 rounded-t-lg',
                    'hover:bg-white',
                    isActive
                      ? 'bg-white border-b-white -mb-px z-10 text-cairos-primary'
                      : 'bg-gray-200 border-b border-gray-300 text-gray-700'
                  )}
                  style={{
                    minWidth: '120px',
                    maxWidth: '240px',
                  }}
                >
                  <span className="truncate flex-1">{tab.label}</span>
                  {tab.isClosable && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(e, tab.id);
                      }}
                      className={clsx(
                        'ml-1 p-0.5 rounded hover:bg-gray-300 transition-colors flex-shrink-0',
                        isActive && 'hover:bg-gray-200'
                      )}
                      aria-label="Close tab"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCloseTab(e as any, tab.id);
                        }
                      }}
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                  )}
                </button>
              );
            })}
            <button
              onClick={handleNewTab}
              className="px-3 py-2 mb-0.5 text-gray-600 hover:bg-gray-200 rounded-t-lg transition-colors flex-shrink-0"
              aria-label="New tab"
              title="New Tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-cairos-border">
      <nav className="flex gap-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'px-3 py-1.5 text-body font-medium transition-all rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:ring-offset-2',
              activeTab === tab.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'ml-2 px-2 py-0.5 rounded-md text-body-sm font-medium',
                  activeTab === tab.id
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};


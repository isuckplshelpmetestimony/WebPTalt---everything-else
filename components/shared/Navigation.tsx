'use client';

import React from 'react';
import { BrowserTabs } from './BrowserTabs';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white border-b border-cairos-border sticky top-0 z-50">
      <BrowserTabs />
    </nav>
  );
};

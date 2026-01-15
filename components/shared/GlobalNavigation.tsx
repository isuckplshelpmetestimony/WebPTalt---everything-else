'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Folder, User, Plus, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface GlobalNavigationProps {
  notificationCount?: number;
  onNewPatient?: () => void;
  onOpenPatient?: () => void;
  onFind?: () => void;
}

export const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  notificationCount = 12,
  onNewPatient,
  onOpenPatient,
  onFind,
}) => {
  const pathname = usePathname();
  const isDocumentation = pathname?.startsWith('/patients') || pathname?.startsWith('/documents');
  
  return (
    <div className="bg-white border-b border-cairos-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row: Global Tabs and System Icons */}
        <div className="flex items-center justify-between h-12">
          {/* Global Tabs */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={clsx(
                'px-4 py-2 text-body font-medium transition-colors border-b-2',
                !isDocumentation
                  ? 'border-cairos-primary text-cairos-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              Home
            </Link>
            <Link
              href="/patients"
              className={clsx(
                'px-4 py-2 text-body font-medium transition-colors border-b-2',
                isDocumentation
                  ? 'border-cairos-primary text-cairos-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              Documentation
            </Link>
          </div>
          
          {/* System Icons & Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cairos-alert text-white text-body-sm rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* Folder */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Folder className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Person */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* New Patient */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onNewPatient}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Patient
            </Button>
            
            {/* Open Patient */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenPatient}
              className="flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              Open Patient
            </Button>
            
            {/* Find */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onFind}
              className="flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Find
            </Button>
            
            {/* Search Field */}
            <div className="w-48">
              <Input
                type="text"
                placeholder="Search: Last Name Or ID"
                className="text-body-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};






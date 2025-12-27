'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: 'Dashboard', icon: FileText },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  // Documents and Patients routes still functional but hidden from nav
  // { href: '/documents', label: 'Documents', icon: FileText },
  // { href: '/patients', label: 'Patients', icon: Users },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white border-b border-cairos-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <h1 className="text-body-lg font-semibold text-cairos-primary">PT Software</h1>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-body font-medium transition-colors',
                      isActive
                        ? 'bg-cairos-primary bg-opacity-10 text-cairos-primary'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};


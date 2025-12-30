'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="sticky top-[43px] z-40 flex items-center gap-1.5 text-body-sm text-gray-600 mb-4 py-3 -mx-6 px-6 bg-cairos-bg border-b border-cairos-border backdrop-blur-sm">
      <Link 
        href="/"
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            {isLast ? (
              <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-900 font-medium">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};


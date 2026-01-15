'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Copy, Printer } from 'lucide-react';
import { clsx } from 'clsx';

interface DocumentActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onPrint?: () => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  onView,
  onEdit,
  onCopy,
  onPrint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Document actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-10 bg-white border border-cairos-border rounded-xl shadow-lg py-1 min-w-[140px]">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onCopy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )}
          {onPrint && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          )}
        </div>
      )}
    </div>
  );
};






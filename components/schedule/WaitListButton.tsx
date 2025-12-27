'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { clsx } from 'clsx';

interface WaitListButtonProps {
  count: number;
  onClick: () => void;
}

export const WaitListButton: React.FC<WaitListButtonProps> = ({
  count,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-cairos-warning bg-opacity-10 text-cairos-warning',
        'hover:bg-opacity-20 transition-colors',
        'font-medium text-body'
      )}
    >
      <Users className="w-5 h-5" />
      <span>Wait List</span>
      {count > 0 && (
        <span className="px-8 py-2 bg-cairos-warning text-white rounded-full text-body-sm font-semibold">
          {count}
        </span>
      )}
    </button>
  );
};


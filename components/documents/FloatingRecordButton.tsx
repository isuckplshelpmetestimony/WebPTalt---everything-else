'use client';

import React from 'react';
import { Mic } from 'lucide-react';

interface FloatingRecordButtonProps {
  isRecording: boolean;
  recordingTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isProcessing?: boolean;
}

export const FloatingRecordButton: React.FC<FloatingRecordButtonProps> = ({
  isRecording,
  recordingTime,
  onStartRecording,
  onStopRecording,
  isProcessing = false,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <button
        type="button"
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isProcessing}
        className={`
          w-14 h-14 rounded-full
          flex items-center justify-center
          transition-all duration-300
          shadow-lg
          ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-gray-400 bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
            {isRecording && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {formatTime(recordingTime)}
              </div>
            )}
          </>
        )}
      </button>
    </div>
  );
};




'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { X, Search } from 'lucide-react';

interface CommonPhrase {
  id: string;
  category: string;
  text: string;
}

interface CommonPhrasesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertPhrase: (phrase: string) => void;
}

const mockPhrases: CommonPhrase[] = [
  {
    id: '1',
    category: 'General Recommendations',
    text: 'Recommend Physical Therapy 2 time(s) a week for 4 week(s), with treatments to consist of:',
  },
  {
    id: '2',
    category: 'General Recommendations',
    text: 'Recommend Physical Therapy 2 time(s) a week for 6 week(s), with treatments to consist of:',
  },
  {
    id: '3',
    category: 'General Recommendations',
    text: 'Recommend Physical Therapy 2 time(s) a week for 8 week(s), with treatments to consist of:',
  },
  {
    id: '4',
    category: 'CPT',
    text: 'Cryotherapy- (97010): Application of cold to decrease local swelling and decrease pain',
  },
  {
    id: '5',
    category: 'CPT',
    text: 'Heat- (97010): Application of heat to increase local circulation and decrease pain',
  },
  {
    id: '6',
    category: 'LE',
    text: 'Flexibility (97110) - active and passive patient stretching. Gait Training-97116: Improve overall gait function including stair climbing. Progressive Strengthening (97110)',
  },
];

export const CommonPhrasesLibrary: React.FC<CommonPhrasesLibraryProps> = ({
  isOpen,
  onClose,
  onInsertPhrase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(mockPhrases.map(p => p.category)))];
  
  const filteredPhrases = mockPhrases.filter(phrase => {
    const matchesSearch = phrase.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedPhrases = filteredPhrases.reduce((acc, phrase) => {
    if (!acc[phrase.category]) {
      acc[phrase.category] = [];
    }
    acc[phrase.category].push(phrase);
    return acc;
  }, {} as Record<string, CommonPhrase[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-cairos-border">
          <h3 className="text-h3 text-gray-900">Common Phrases</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-cairos-border">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a common phrase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-body-xs transition-colors ${
                  selectedCategory === category
                    ? 'bg-cairos-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(groupedPhrases).map(([category, phrases]) => (
            <div key={category}>
              <h4 className="text-body-sm font-semibold text-gray-700 mb-2">{category}</h4>
              <div className="space-y-2">
                {phrases.map(phrase => (
                  <button
                    key={phrase.id}
                    onClick={() => {
                      onInsertPhrase(phrase.text);
                      onClose();
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-body-sm text-gray-900"
                  >
                    {phrase.text}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredPhrases.length === 0 && (
            <div className="text-center py-8">
              <p className="text-body-sm text-gray-500">No phrases found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};




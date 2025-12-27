'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function DocumentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Documents' }
      ]} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-h1">Documents</h1>
        <Link href="/documents/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Document
          </Button>
        </Link>
      </div>
      
      <div className="text-body text-gray-600">
        Document list will be displayed here
      </div>
    </div>
  );
}


import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/shared/Navigation';

export const metadata: Metadata = {
  title: 'PT Software',
  description: 'Modern Physical Therapy Software',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}


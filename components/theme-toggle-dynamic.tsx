'use client';

import dynamic from 'next/dynamic';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamic import để tránh hydration mismatch
const ThemeToggleButtonClient = dynamic(
  () => import('./theme-toggle').then((mod) => ({ default: mod.ThemeToggleButton })),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    ),
  }
);

export function ThemeToggleButton() {
  return <ThemeToggleButtonClient />;
}


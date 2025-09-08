'use client';

import dynamic from 'next/dynamic';
import {
  Select,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ThemeToggleClient = dynamic(
  () => import('./theme-toggle').then((mod) => ({ default: mod.ThemeToggle })),
  {
    ssr: false,
    loading: () => (
      <Select disabled>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
      </Select>
    ),
  }
);

export function ThemeToggle() {
  return <ThemeToggleClient />;
}

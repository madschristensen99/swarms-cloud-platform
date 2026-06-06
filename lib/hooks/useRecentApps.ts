'use client';

import { useCallback, useEffect, useState } from 'react';
import { APPS } from '@/lib/apps-catalog';

const STORAGE_KEY = 'recentApps';
const MAX_ENTRIES = 8;

export type RecentVisit = {
  href: string;
  visitedAt: number;
};

const APP_HREFS = new Set(APPS.map((a) => a.href));

function readStorage(): RecentVisit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (v): v is RecentVisit =>
          v &&
          typeof v.href === 'string' &&
          typeof v.visitedAt === 'number' &&
          APP_HREFS.has(v.href)
      )
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function writeStorage(visits: RecentVisit[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function useRecentApps() {
  const [visits, setVisits] = useState<RecentVisit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setVisits(readStorage());
    setHydrated(true);

    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setVisits(readStorage());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const recordVisit = useCallback((href: string) => {
    if (!APP_HREFS.has(href)) return;
    setVisits((prev) => {
      const without = prev.filter((v) => v.href !== href);
      const next = [{ href, visitedAt: Date.now() }, ...without].slice(
        0,
        MAX_ENTRIES
      );
      writeStorage(next);
      return next;
    });
  }, []);

  return { visits, recordVisit, hydrated };
}

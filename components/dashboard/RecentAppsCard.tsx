'use client';

import React from 'react';
import Link from 'next/link';
import { useRecentApps } from '@/lib/hooks/useRecentApps';
import { APPS } from '@/lib/apps-catalog';
import { Clock } from 'lucide-react';

const APP_BY_HREF = new Map(APPS.map((a) => [a.href, a]));

export function RecentAppsCard() {
  const { visits, hydrated } = useRecentApps();

  const entries = visits
    .map((v) => {
      const app = APP_BY_HREF.get(v.href);
      return app ? { ...v, app } : null;
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .slice(0, 12);

  return (
    <section className="rounded-lg border border-border bg-card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Recently visited
          </h2>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        {!hydrated ? (
          <div className="h-24 rounded-md bg-muted/30 animate-pulse" />
        ) : entries.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            Apps you visit will appear here.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {entries.map(({ app }) => {
              const Icon = app.icon;
              return (
                <li key={app.href}>
                  <Link
                    href={app.href}
                    className="flex items-center gap-2.5 py-1 group"
                  >
                    <Icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span className="text-sm text-accent group-hover:underline truncate">
                      {app.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-border text-center">
        <Link
          href="/apps"
          className="text-xs text-accent hover:underline"
        >
          View all apps
        </Link>
      </div>
    </section>
  );
}

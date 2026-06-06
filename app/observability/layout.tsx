import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Observability',
  description:
    'Monitor API request performance, latency, and error rates across every agent and swarm execution on Swarms Cloud.',
  path: '/observability',
  keywords: [
    'observability',
    'api monitoring',
    'latency',
    'error rate',
    'cache hit rate',
    'rate limits',
    'agent telemetry',
  ],
});

export default function ObservabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

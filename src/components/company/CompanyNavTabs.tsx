'use client';

import Link from 'next/link';

interface CompanyNavTabsProps {
  ticker: string;
  activeTab: string;
  availableMetrics?: Record<string, { isAvailable: boolean }>;
}

const TABS = [
  { id: 'overview', label: 'Overview', path: '' },
  { id: 'revenue', label: 'Revenue', path: '/revenue', metricId: 'revenue' },
  { id: 'net-income', label: 'Net Income', path: '/net-income', metricId: 'net-income' },
  { id: 'eps', label: 'EPS', path: '/eps', metricId: 'eps' },
  { id: 'assets', label: 'Assets', path: '/assets', metricId: 'total-assets' },
  { id: 'liabilities', label: 'Liabilities', path: '/liabilities', metricId: 'total-debt' },
  { id: 'cash', label: 'Cash', path: '/cash', metricId: 'cash' },
  { id: 'cash-flow', label: 'Cash Flow', path: '/cash-flow', metricId: 'operating-cash-flow' },
];

export default function CompanyNavTabs({
  ticker,
  activeTab,
  availableMetrics,
}: CompanyNavTabsProps) {
  const normalizedTicker = ticker.toLowerCase();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
      }}
      className="company-nav-tabs"
    >
      {TABS.map((tab) => {
        // If availableMetrics is provided, check if this tab metric is disabled/missing
        if (availableMetrics && tab.metricId && availableMetrics[tab.metricId]?.isAvailable === false) {
          return null; // Do not render links for missing metric data per SEO guidelines
        }

        const isActive = activeTab === tab.id;
        const href = `/company/${normalizedTicker}${tab.path}`;

        return (
          <Link
            key={tab.id}
            href={href}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: isActive ? 700 : 500,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-500)' : 'rgba(255, 255, 255, 0.05)',
              border: isActive ? '1px solid var(--primary-400)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </Link>
        );
      })}

      <Link
        href="/compare"
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 500,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          color: 'var(--accent-purple)',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          marginLeft: 'auto',
        }}
      >
        Compare Mode ➔
      </Link>
    </div>
  );
}

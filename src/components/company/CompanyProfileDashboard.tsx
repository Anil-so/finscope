'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { SECProcessedMetric, SECHistoricalData } from '@/types/sec';
import { SECService } from '@/lib/services/secService';
import CompanyNavTabs from '@/components/company/CompanyNavTabs';
import FinancialChart from '@/components/company/FinancialChart';
import { Building2, Globe, Database, ExternalLink, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompanyProfileDashboardProps {
  company: Company;
}

const METRIC_CARDS = [
  { id: 'revenue', label: 'Revenue (Top-Line)', slug: 'revenue' },
  { id: 'net-income', label: 'Net Income (Bottom-Line)', slug: 'net-income' },
  { id: 'total-assets', label: 'Total Assets', slug: 'assets' },
  { id: 'total-debt', label: 'Total Liabilities', slug: 'liabilities' },
  { id: 'cash', label: 'Cash & Cash Equivalents', slug: 'cash' },
  { id: 'operating-cash-flow', label: 'Operating Cash Flow', slug: 'cash-flow' },
  { id: 'eps', label: 'Earnings Per Share (EPS)', slug: 'eps' },
];

export default function CompanyProfileDashboard({ company }: CompanyProfileDashboardProps) {
  const [metrics, setMetrics] = useState<Record<string, SECProcessedMetric>>({});
  const [history, setHistory] = useState<SECHistoricalData>({ revenue: [], netIncome: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const edgarUrl = SECService.getEDGARFilingUrl(company.cik);
  const tickerLower = company.ticker.toLowerCase();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`/api/sec/facts?cik=${company.cik}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch SEC facts');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.metrics) setMetrics(data.metrics);
          if (data.history) setHistory(data.history);
        }
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [company.cik]);

  return (
    <div className="company-profile-dashboard">
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href="/companies"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--primary-500)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Companies Directory
        </Link>
      </div>

      {/* Internal Navigation Tabs */}
      <CompanyNavTabs ticker={tickerLower} activeTab="overview" availableMetrics={metrics} />

      {/* Header Profile Glass Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{company.exchange}</span>
              <span className="badge badge-emerald">CIK: {company.cik}</span>
              <span className="badge badge-purple">{company.sector}</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {company.name} ({company.ticker})
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{company.industry}</p>
          </div>

          <a
            href={edgarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="search-button"
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Official SEC Filings <ExternalLink size={16} />
          </a>
        </div>

        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', opacity: 0.9 }}>
          {company.description}
        </p>
      </div>

      {/* Latest Financial Metrics Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Latest SEC Financial Metrics</h2>
          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} /> Official SEC EDGAR Disclosures
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {METRIC_CARDS.map((card) => {
            const m = metrics[card.id];
            const hasData = m && m.isAvailable;

            return (
              <div key={card.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{card.label}</div>
                  {loading ? (
                    <span className="badge badge-primary">Loading SEC Data...</span>
                  ) : error ? (
                    <span className="badge badge-muted">Error loading</span>
                  ) : hasData ? (
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-500)', marginBottom: '0.25rem' }}>
                        {m.formattedValue}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{m.period}</span>
                        <span className="metric-sec-tag">{m.secTag}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="badge badge-muted">Not available</span>
                  )}
                </div>

                {hasData && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.65rem' }}>
                    <Link
                      href={`/company/${tickerLower}/${card.slug}`}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--primary-500)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      Historical {card.label.split(' ')[0]} Trends & Disclosures <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Revenue & Net Income Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <FinancialChart
          title="Historical Annual Revenue (SEC 10-K)"
          data={history.revenue}
          primaryColor="var(--primary-500)"
          gradientId={`rev-grad-${company.ticker}`}
        />
        <FinancialChart
          title="Historical Annual Net Income (SEC 10-K)"
          data={history.netIncome}
          primaryColor="var(--accent-purple)"
          gradientId={`net-grad-${company.ticker}`}
        />
      </div>

      {/* Financial History Table */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Annual Financial Disclosures History</h3>
          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={12} /> Source: Official SEC EDGAR (data.sec.gov)
          </span>
        </div>

        {history.revenue.length > 0 || history.netIncome.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fiscal Year</th>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--primary-500)', fontSize: '0.85rem' }}>Revenue (10-K)</th>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--accent-purple)', fontSize: '0.85rem' }}>Net Income (10-K)</th>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>SEC Filing Date</th>
              </tr>
            </thead>
            <tbody>
              {history.revenue.map((revPt) => {
                const netPt = history.netIncome.find((n) => n.year === revPt.year);
                return (
                  <tr key={revPt.year} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>{revPt.label}</td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--primary-500)' }}>{revPt.formattedVal}</td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
                      {netPt ? netPt.formattedVal : 'Not available'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{revPt.filedDate || 'SEC EDGAR'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading or processing historical SEC filings...</p>
        )}
      </div>
    </div>
  );
}

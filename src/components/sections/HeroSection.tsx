'use client';

import SearchBox from '@/components/common/SearchBox';
import { ShieldCheck, Zap, BarChart2 } from 'lucide-react';

export default function HeroSection() {
  const quickTickers = [
    { name: 'Apple', ticker: 'AAPL' },
    { name: 'Microsoft', ticker: 'MSFT' },
    { name: 'NVIDIA', ticker: 'NVDA' },
    { name: 'Amazon', ticker: 'AMZN' },
    { name: 'Tesla', ticker: 'TSLA' },
    { name: 'Meta', ticker: 'META' },
  ];

  return (
    <section className="hero-section">
      <div className="container">
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="badge badge-emerald">
            <ShieldCheck size={14} /> SEC EDGAR Powered Platform
          </span>
        </div>

        <h1 className="hero-title">
          Financial Data. <span className="gradient-text">Made Simple.</span>
        </h1>

        <p className="hero-subtitle">
          Instantly explore public company SEC filings, standardized financial metrics, and company disclosures with transparent, un-cluttered insights.
        </p>

        <SearchBox />

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Popular Searches:</span>
          {quickTickers.map((item) => (
            <a
              key={item.ticker}
              href={`#company-card-${item.name.toLowerCase()}`}
              className="badge badge-primary"
              style={{ textTransform: 'none', textDecoration: 'none', transition: 'all 0.2s ease' }}
            >
              {item.name} ({item.ticker})
            </a>
          ))}
        </div>

        <div
          style={{
            marginTop: '3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            textAlign: 'left',
          }}
        >
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-500)' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Direct SEC Data</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Standardized information parsed from official SEC EDGAR 10-K, 10-Q, and XBRL disclosures.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-emerald)' }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Lightning Fast</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Optimized Next.js architecture built for instant search, high readability, and SEO performance.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-purple)' }}>
                <BarChart2 size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Unbiased Structure</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Clean layout focused strictly on verifiable corporate reporting metrics and disclosures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

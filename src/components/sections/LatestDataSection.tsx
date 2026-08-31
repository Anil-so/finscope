'use client';

import { SEC_FILING_CATEGORIES } from '@/lib/data/initialCompanies';
import { FileText, Clock, ShieldAlert } from 'lucide-react';


export default function LatestDataSection() {
  return (
    <section className="section" id="latest-data-section" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={18} color="var(--accent-emerald)" />
              <span className="badge badge-emerald">SEC EDGAR Architecture</span>
            </div>
            <h2 className="section-title">Latest Financial Data Structure</h2>
            <p className="section-subtitle">
              FinScope indexes official corporate filings submitted directly to the U.S. Securities & Exchange Commission.
            </p>
          </div>
        </div>

        <div className="filing-grid">
          {SEC_FILING_CATEGORIES.map((filing) => (
            <div key={filing.formType} className="glass-card filing-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                  Form {filing.formType}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{filing.frequency}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{filing.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {filing.description}
              </p>
              <div
                style={{
                  fontSize: '0.825rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  borderLeft: '3px solid var(--accent-emerald)',
                }}
              >
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  Analytical Value:
                </strong>
                {filing.importance}
              </div>
            </div>
          ))}
        </div>

        <div
          className="glass-card"
          style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderColor: 'rgba(245, 158, 11, 0.25)',
          }}
        >
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.65rem', borderRadius: '10px', color: 'var(--accent-amber)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Official SEC EDGAR Data Pipeline Integration Prepared
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              FinScope is structured to consume live XBRL disclosures directly from the SEC EDGAR API (`data.sec.gov/api/xbrl`). Raw filings contain un-altered primary source financial statements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

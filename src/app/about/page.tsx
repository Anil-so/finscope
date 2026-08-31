import { Metadata } from 'next';
import { ShieldCheck, Database, FileSearch, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About FinScope | Financial Data. Made Simple.',
  description: 'Learn about FinScope, our mission to simplify SEC EDGAR financial disclosures, and our commitment to un-biased public market data transparency.',
};

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Mission & Vision
          </span>
          <h1 className="section-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            About Fin<span className="gradient-text">Scope</span>
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--primary-500)' }}>
            &ldquo;Financial Data. Made Simple.&rdquo;
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Our Purpose</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Public financial statements filed with regulatory authorities are often locked behind dense text documents, fragmented tables, or complex software platforms. <strong>FinScope</strong> was created to eliminate friction and bring clarity to public market reporting.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            By structuring official U.S. Securities & Exchange Commission (SEC) EDGAR submissions into standardized visual formats, FinScope empowers investors, analysts, researchers, and students to access clear financial insights instantly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--primary-500)', marginBottom: '0.75rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Direct SEC Sourcing</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              All reporting company profiles and data schemas reference official SEC CIK filings (Forms 10-K, 10-Q, 8-K).
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--accent-emerald)', marginBottom: '0.75rem' }}>
              <Database size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Standardized Taxonomy</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              We map US-GAAP XBRL tags into uniform categories for easy comparison across fiscal years and industry peers.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--accent-purple)', marginBottom: '0.75rem' }}>
              <FileSearch size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Un-Biased Clarity</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              FinScope does not provide investment advice or alter primary disclosures. We present raw facts with maximum speed and clarity.
            </p>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 64, 0.5))',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Data Disclaimer</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            FinScope is an independent financial data aggregation platform. All corporate trademarks, ticker symbols, and filing documents belong to their respective owners and the SEC EDGAR system. FinScope is for informational and educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

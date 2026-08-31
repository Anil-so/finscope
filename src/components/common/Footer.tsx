import Link from 'next/link';
import { TrendingUp, ShieldCheck, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" className="brand-logo" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon">
                <TrendingUp size={20} />
              </div>
              <span className="brand-title">
                Fin<span className="gradient-text">Scope</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '360px' }}>
              Financial Data. Made Simple. Providing standardized, transparent access to public company filings powered by SEC EDGAR data.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} color="var(--accent-emerald)" /> SEC Data Pipeline
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Database size={16} color="var(--primary-500)" /> Official Filings
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/companies">Company Directory</Link>
              </li>
              <li>
                <Link href="/compare">Compare Companies</Link>
              </li>
              <li>
                <Link href="/about">About FinScope</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SEC Filings</h4>
            <ul className="footer-links">
              <li>
                <span style={{ color: 'var(--text-dim)' }}>10-K Annual Reports</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-dim)' }}>10-Q Quarterly Reports</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-dim)' }}>8-K Material Events</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-dim)' }}>US-GAAP XBRL Metrics</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular SEC Filings</h4>
            <ul className="footer-links">
              <li>
                <Link href="/company/aapl">Apple Inc. (AAPL)</Link>
              </li>
              <li>
                <Link href="/company/msft">Microsoft Corp. (MSFT)</Link>
              </li>
              <li>
                <Link href="/company/nvda">NVIDIA Corp. (NVDA)</Link>
              </li>
              <li>
                <Link href="/company/amzn">Amazon.com, Inc. (AMZN)</Link>
              </li>
              <li>
                <Link href="/company/tsla">Tesla, Inc. (TSLA)</Link>
              </li>
              <li>
                <Link href="/company/meta">Meta Platforms, Inc. (META)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} FinScope. All rights reserved. Data sourced from U.S. Securities and Exchange Commission (SEC) EDGAR system.
          </div>
          <div>Financial Data. Made Simple.</div>
        </div>
      </div>
    </footer>
  );
}

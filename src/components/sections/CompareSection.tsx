'use client';

import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export default function CompareSection() {
  return (
    <section className="section" id="company-comparisons-section">
      <div className="container">
        <div className="compare-box">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Layers size={20} color="var(--primary-500)" />
            <span className="badge badge-purple">Side-by-Side Analysis</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Company Comparisons
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Compare public companies side-by-side on standardized financial reporting structures, fiscal period schedules, and SEC disclosure metrics.
          </p>

          <Link
            href="/compare"
            className="search-button"
            style={{
              display: 'inline-flex',
              textDecoration: 'none',
              padding: '0.85rem 2rem',
              fontSize: '1rem',
            }}
          >
            Explore Comparison Tool <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

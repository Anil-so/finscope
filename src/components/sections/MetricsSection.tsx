'use client';

import { FINANCIAL_METRICS_LIST } from '@/lib/data/initialCompanies';
import { BarChart3, HelpCircle, Code2 } from 'lucide-react';


export default function MetricsSection() {
  return (
    <section className="section" id="financial-metrics-section" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary-500)" />
              <span className="badge badge-purple">Standardized Accounting</span>
            </div>
            <h2 className="section-title">Standard Financial Metrics</h2>
            <p className="section-subtitle">
              FinScope standardizes GAAP reporting metrics extracted from SEC EDGAR XBRL taxonomy taxonomies.
            </p>
          </div>
        </div>

        <div className="metrics-grid">
          {FINANCIAL_METRICS_LIST.map((metric) => (
            <div key={metric.id} className="glass-card metric-card">
              <div className="metric-header">
                <div className="metric-icon-wrap">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="metric-name">{metric.name}</h3>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {metric.category}
                  </span>
                </div>
              </div>

              <p className="metric-desc">{metric.description}</p>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.825rem',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  <HelpCircle size={14} color="var(--primary-500)" /> Why It Matters:
                </div>
                {metric.importance}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={14} color="var(--accent-emerald)" />
                <span className="metric-sec-tag">{metric.secTag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

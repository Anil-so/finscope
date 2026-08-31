'use client';

import { Company } from '@/types/company';
import { SECProcessedMetric, SECHistoricalPoint, SECMetricSlugConfig } from '@/types/sec';
import { SECService } from '@/lib/services/secService';
import CompanyNavTabs from '@/components/company/CompanyNavTabs';
import FinancialChart from '@/components/company/FinancialChart';
import { Building2, ExternalLink, ShieldCheck, Database, ArrowLeft, BookOpen, Calculator } from 'lucide-react';
import Link from 'next/link';

interface MetricDetailViewProps {
  company: Company;
  config: SECMetricSlugConfig;
  metric: SECProcessedMetric;
  historyPoints: SECHistoricalPoint[];
  allMetrics: Record<string, SECProcessedMetric>;
}

const METRIC_ACCOUNTING_EXPLANATIONS: Record<string, { formula: string; standard: string; overview: string; keyTakeaway: string }> = {
  revenue: {
    formula: 'Total Revenue = Gross Customer Sales - Sales Returns & Discounts',
    standard: 'US-GAAP ASC 606 (Revenue from Contracts with Customers)',
    overview:
      'Revenue represents the total top-line income recognized by a corporation for goods transferred or services rendered to customers during the fiscal reporting period. Under US-GAAP ASC 606, revenue is recognized when performance obligations are satisfied.',
    keyTakeaway:
      'Top-line revenue indicates overall business scale, customer adoption, and enterprise market expansion before deducting operating overhead or taxes.',
  },
  'net-income': {
    formula: 'Net Income = Operating Income + Non-Operating Revenues - Expenses & Taxes',
    standard: 'US-GAAP ASC 225 (Income Statement Presentation)',
    overview:
      'Net Income is the ultimate bottom-line financial performance indicator of a corporation. It represents the net earnings remaining after deducting cost of goods sold (COGS), operating expenses, research & development, interest, and federal/state income tax liabilities.',
    keyTakeaway:
      'Positive net income reflects sustainable operational profitability, whereas negative net income indicates a net fiscal loss during the filing period.',
  },
  eps: {
    formula: 'Basic EPS = (Net Income - Preferred Dividends) / Weighted Average Common Shares',
    standard: 'US-GAAP ASC 260 (Earnings Per Share)',
    overview:
      'Earnings Per Share (EPS) measures the exact dollar portion of corporate net income allocated to each outstanding share of common stock. It standardizes corporate earnings across varying capital structures.',
    keyTakeaway:
      'Higher EPS indicates greater earning power per common share and serves as a fundamental valuation input for Price-to-Earnings (P/E) calculations.',
  },
  assets: {
    formula: 'Total Assets = Current Assets + Non-Current Assets = Total Liabilities + Stockholders Equity',
    standard: 'US-GAAP ASC 210 (Balance Sheet Classification)',
    overview:
      'Total Assets represent the total economic resources owned or controlled by the enterprise expected to generate future economic value. Includes current liquid assets (cash, receivables, inventory) and long-term capital assets (property, equipment, intangible assets).',
    keyTakeaway:
      'The balance sheet equation dictates that total assets must strictly equal the sum of total liabilities and stockholders equity.',
  },
  liabilities: {
    formula: 'Total Liabilities = Current Liabilities + Long-Term Obligations & Debt',
    standard: 'US-GAAP ASC 210 (Balance Sheet Obligations)',
    overview:
      'Total Debt and Liabilities represent all legal financial obligations owed by the corporation to external creditors, vendors, bondholders, and financial institutions. Includes accounts payable, short-term borrowings, and long-term notes payable.',
    keyTakeaway:
      'Comparing total liabilities against assets and cash flow provides perspective on debt solvency, leverage risk, and financial obligation coverage.',
  },
  cash: {
    formula: 'Cash & Cash Equivalents = Physical Currency + Short-Term Liquid Treasury Securities (< 90 Days)',
    standard: 'US-GAAP ASC 230 (Statement of Cash Flows)',
    overview:
      'Cash and Cash Equivalents comprise available liquid currency, bank deposits, money market funds, and highly liquid short-term investments with original maturities of 90 days or less.',
    keyTakeaway:
      'Liquid cash reserves provide immediate liquidity to fund capital expenditures, research, debt servicing, and economic downturn cushions.',
  },
  'cash-flow': {
    formula: 'Operating Cash Flow = Net Income + Non-Cash Depreciation/Amortization ± Working Capital Adjustments',
    standard: 'US-GAAP ASC 230 (Direct/Indirect Cash Flow from Operations)',
    overview:
      'Operating Cash Flow measures the actual cash generated or consumed directly by primary core business activities during the reporting period, adjusting accounting net income for non-cash expenses (depreciation) and working capital movements.',
    keyTakeaway:
      'Operating cash flow reflects true cash generation quality, free of accrual accounting adjustments.',
  },
};

export default function MetricDetailView({
  company,
  config,
  metric,
  historyPoints,
  allMetrics,
}: MetricDetailViewProps) {
  const edgarUrl = SECService.getEDGARFilingUrl(company.cik);
  const tickerLower = company.ticker.toLowerCase();
  const acc = METRIC_ACCOUNTING_EXPLANATIONS[config.slug] || {
    formula: `${config.name} US-GAAP XBRL Measure`,
    standard: 'US-GAAP Standard Reporting',
    overview: config.description,
    keyTakeaway: `Official SEC disclosure metric for ${company.name}.`,
  };

  return (
    <div className="metric-detail-view">
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href={`/company/${tickerLower}`}
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
          <ArrowLeft size={16} /> Back to {company.name} Overview
        </Link>
      </div>

      {/* Cross-linking Navigation Tabs */}
      <CompanyNavTabs ticker={tickerLower} activeTab={config.slug} availableMetrics={allMetrics} />

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
              {company.name} ({company.ticker}) {config.name}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{config.description}</p>
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
      </div>

      {/* Metric Highlight Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary-500)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} /> Official SEC US-GAAP Fact
          </span>
          <span className="metric-sec-tag">{metric.secTag}</span>
        </div>

        <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--primary-500)', marginBottom: '0.5rem' }}>
          {metric.formattedValue}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span>Reporting Period: <strong style={{ color: 'var(--text-main)' }}>{metric.period}</strong></span>
          <span>SEC Filing Date: <strong style={{ color: 'var(--text-main)' }}>{metric.filedDate || 'SEC EDGAR'}</strong></span>
        </div>
      </div>

      {/* Accounting Context & Explanation Section */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BookOpen size={18} color="var(--primary-500)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>About {config.name} & Accounting Context</h3>
        </div>

        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          {acc.overview}
        </p>

        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-500)', marginBottom: '0.35rem' }}>
            <Calculator size={16} /> Accounting Formula & Standard
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {acc.formula}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Governing Framework: {acc.standard}
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          <strong>Key Analysis Insight:</strong> {acc.keyTakeaway}
        </p>
      </div>

      {/* SVG Historical Chart */}
      {historyPoints && historyPoints.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <FinancialChart
            title={`Historical Annual ${config.name} (SEC 10-K)`}
            data={historyPoints}
            primaryColor="var(--primary-500)"
            gradientId={`chart-${config.slug}-${tickerLower}`}
          />
        </div>
      )}

      {/* Multi-Year Disclosure Table */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Annual {config.name} Disclosure History</h3>
          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={12} /> Source: Official SEC EDGAR (data.sec.gov)
          </span>
        </div>

        {historyPoints && historyPoints.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fiscal Year</th>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--primary-500)', fontSize: '0.85rem' }}>{config.name}</th>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Filing Form</th>
                <th style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>SEC Filing Date</th>
              </tr>
            </thead>
            <tbody>
              {historyPoints.map((pt) => (
                <tr key={pt.year} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>{pt.label}</td>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--primary-500)', fontSize: '1.05rem' }}>
                    {pt.formattedVal}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.85rem' }}>
                    <span className="badge badge-primary">{pt.form}</span>
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {pt.filedDate || 'SEC EDGAR'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Single period disclosure reported: {metric.formattedValue} ({metric.period}).
          </p>
        )}
      </div>
    </div>
  );
}

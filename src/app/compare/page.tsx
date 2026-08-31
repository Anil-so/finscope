import { Metadata } from 'next';
import CompareView from '@/components/company/CompareView';
import { Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Companies | FinScope',
  description:
    'Compare public companies side-by-side on SEC EDGAR filing disclosures, US-GAAP metrics, revenue, net income, assets, debt, cash flow, and EPS.',
};

export default function ComparePage() {
  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
            <Layers size={14} /> Side-by-Side Analysis
          </span>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
            Compare Companies
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.05rem' }}>
            Select two public corporations to compare SEC reporting structures, Central Index Keys (CIK), and standardized financial metrics.
          </p>
        </div>

        <CompareView />
      </div>
    </div>
  );
}

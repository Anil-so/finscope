'use client';

import { useState, useEffect } from 'react';
import { INITIAL_COMPANIES } from '@/lib/data/initialCompanies';
import { Company } from '@/types/company';
import { SECProcessedMetric } from '@/types/sec';
import { Building2, ArrowLeftRight, Database } from 'lucide-react';

const METRICS = [
  {
    id: 'revenue',
    name: 'Revenue (Top-Line)',
    category: 'Income Statement',
    secTag: 'us-gaap:Revenues',
    description: 'Total revenue earned from goods and services delivered during fiscal period.',
  },
  {
    id: 'net-income',
    name: 'Net Income (Bottom-Line)',
    category: 'Income Statement',
    secTag: 'us-gaap:NetIncomeLoss',
    description: 'Total profit remaining after deducting operating expenses, taxes, and interest.',
  },
  {
    id: 'total-assets',
    name: 'Total Assets',
    category: 'Balance Sheet',
    secTag: 'us-gaap:Assets',
    description: 'Sum of all current and long-term economic resources owned by the company.',
  },
  {
    id: 'total-debt',
    name: 'Total Debt',
    category: 'Balance Sheet',
    secTag: 'us-gaap:Liabilities',
    description: 'Total short-term and long-term debt obligations reported on balance sheet.',
  },
  {
    id: 'cash',
    name: 'Cash & Cash Equivalents',
    category: 'Balance Sheet',
    secTag: 'us-gaap:CashAndCashEquivalentsAtCarryingValue',
    description: 'Available liquid cash and short-term market investments.',
  },
  {
    id: 'operating-cash-flow',
    name: 'Operating Cash Flow',
    category: 'Cash Flow Statement',
    secTag: 'us-gaap:NetCashProvidedByUsedInOperatingActivities',
    description: 'Net cash generated directly from primary business operations.',
  },
  {
    id: 'eps',
    name: 'Earnings Per Share (EPS)',
    category: 'Income Statement',
    secTag: 'us-gaap:EarningsPerShareBasic',
    description: 'Net income allocated to each outstanding share of common stock.',
  },
];

function getComp(t: string, fallbackIdx: number): Company {
  for (let i = 0; i < INITIAL_COMPANIES.length; i++) {
    if (INITIAL_COMPANIES[i].ticker === t) return INITIAL_COMPANIES[i];
  }
  return INITIAL_COMPANIES[fallbackIdx];
}

export default function CompareView() {
  const [selectedA, setSelectedA] = useState('AAPL');
  const [selectedB, setSelectedB] = useState('MSFT');

  const [activeA, setActiveA] = useState('AAPL');
  const [activeB, setActiveB] = useState('MSFT');

  const [metricsA, setMetricsA] = useState<Record<string, SECProcessedMetric>>({});
  const [metricsB, setMetricsB] = useState<Record<string, SECProcessedMetric>>({});

  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const [errorA, setErrorA] = useState(false);
  const [errorB, setErrorB] = useState(false);

  const compA = getComp(activeA, 0);
  const compB = getComp(activeB, 1);

  const handleSwap = () => {
    setSelectedA((a) => {
      setSelectedB(a);
      return selectedB;
    });
    setActiveA((a) => {
      setActiveB(a);
      return activeB;
    });
  };

  const handleCompare = () => {
    setActiveA(selectedA);
    setActiveB(selectedB);
  };

  useEffect(() => {
    let isMounted = true;
    setLoadingA(true);
    setErrorA(false);

    fetch('/api/sec/facts?cik=' + compA.cik)
      .then((res) => {
        if (!res.ok) throw new Error('SEC fetch error');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.metrics) {
          setMetricsA(data.metrics);
        }
      })
      .catch((err) => {
        console.error('Fetch SEC facts A error:', err);
        if (isMounted) setErrorA(true);
      })
      .finally(() => {
        if (isMounted) setLoadingA(false);
      });

    return () => {
      isMounted = false;
    };
  }, [compA.cik]);

  useEffect(() => {
    let isMounted = true;
    setLoadingB(true);
    setErrorB(false);

    fetch('/api/sec/facts?cik=' + compB.cik)
      .then((res) => {
        if (!res.ok) throw new Error('SEC fetch error');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.metrics) {
          setMetricsB(data.metrics);
        }
      })
      .catch((err) => {
        console.error('Fetch SEC facts B error:', err);
        if (isMounted) setErrorB(true);
      })
      .finally(() => {
        if (isMounted) setLoadingB(false);
      });

    return () => {
      isMounted = false;
    };
  }, [compB.cik]);

  return (
    <div className="compare-view-container">
      <div className="glass-card" style={{ padding: '2rem' }}>
        <Building2 size={20} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min-content 1fr' }}>
          <select value={selectedA} onChange={(e) => setSelectedA(e.target.value)}>
            {INITIAL_COMPANIES.map((c) => (
              <option key={c.ticker} value={c.ticker} disabled={c.ticker === selectedB}>
                {c.name} ({c.ticker})
              </option>
            ))}
          </select>
          <button onClick={handleSwap}>
            <ArrowLeftRight size={20} />
          </button>
          <select value={selectedB} onChange={(e) => setSelectedB(e.target.value)}>
            {INITIAL_COMPANIES.map((c) => (
              <option key={c.ticker} value={c.ticker} disabled={c.ticker === selectedA}>
                {c.name} ({c.ticker})
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleCompare}>Compare</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">{compA.exchange}</span>
            <span className="badge badge-emerald">CIK: {compA.cik}</span>
          </div>
          <h3>{compA.name} ({compA.ticker})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{compA.industry}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-purple">{compB.exchange}</span>
            <span className="badge badge-emerald">CIK: {compB.cik}</span>
          </div>
          <h3>{compB.name} ({compB.ticker})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{compB.industry}</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3>Financial Disclosure Metrics</h3>
          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={12} /> Source: Official SEC EDGAR (data.sec.gov)
          </span>
        </div>
        <table>
          <tbody>
            {METRICS.map((m) => {
              const factA = metricsA[m.id];
              const factB = metricsB[m.id];

              return (
                <tr key={m.id}>
                  <td>
                    <div>{m.name}</div>
                    <div>{m.description}</div>
                    <span>{factA?.secTag || factB?.secTag || m.secTag}</span>
                  </td>
                  <td>
                    {loadingA ? (
                      <span className="badge badge-primary">Loading SEC Data...</span>
                    ) : errorA ? (
                      <span className="badge badge-muted">Error loading SEC data</span>
                    ) : factA && factA.isAvailable ? (
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-500)', fontSize: '1.1rem' }}>
                          {factA.formattedValue}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {factA.period}
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-muted">Not available</span>
                    )}
                  </td>
                  <td>
                    {loadingB ? (
                      <span className="badge badge-purple">Loading SEC Data...</span>
                    ) : errorB ? (
                      <span className="badge badge-muted">Error loading SEC data</span>
                    ) : factB && factB.isAvailable ? (
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-purple)', fontSize: '1.1rem' }}>
                          {factB.formattedValue}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {factB.period}
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-muted">Not available</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import CompanyCard from '@/components/company/CompanyCard';
import { Search, Building2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface CompanyDirectoryViewProps {
  initialCompanies: Company[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function CompanyDirectoryView({
  initialCompanies,
  initialTotal,
  initialTotalPages,
}: CompanyDirectoryViewProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/sec/companies?q=${encodeURIComponent(query)}&page=${page}&limit=24`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.companies) {
            setCompanies(data.companies);
            setTotal(data.total);
            setTotalPages(data.totalPages);
          }
        })
        .catch((err) => console.error('Directory fetch error:', err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="company-directory-view">
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">
            <Building2 size={14} /> Official SEC Dataset
          </span>
          <span className="badge badge-emerald">
            {total.toLocaleString()} Companies Indexed
          </span>
        </div>

        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
          Public Company Directory
        </h1>
        <p className="section-subtitle" style={{ fontSize: '1.05rem', marginBottom: '1.75rem' }}>
          Search and browse 10,390+ U.S. SEC EDGAR registered public corporations, Central Index Keys (CIK), and live financial disclosures.
        </p>

        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
          </div>
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search by company name, ticker symbol (e.g. AAPL, AMD, GOOGL), or CIK..."
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3.25rem',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-glow)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
            }}
            id="company-directory-search-input"
          />
        </div>
      </div>

      {companies.length > 0 ? (
        <div className="company-grid" style={{ marginBottom: '2.5rem' }}>
          {companies.map((c) => (
            <CompanyCard key={`${c.ticker}-${c.cik}`} company={c} />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Companies Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No SEC registered company matched "{query}". Try searching by ticker (e.g., AAPL, NVDA, AMD, GOOGL) or CIK.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="glass-card"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              color: page === 1 ? 'var(--text-muted)' : 'var(--text-main)',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
            id="prev-page-btn"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-main)',
              fontWeight: 600,
              padding: '0.6rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="glass-card"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              color: page === totalPages ? 'var(--text-muted)' : 'var(--text-main)',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
            id="next-page-btn"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

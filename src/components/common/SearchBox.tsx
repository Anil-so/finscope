'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Building2, ExternalLink } from 'lucide-react';
import { Company } from '@/types/company';
import { SECService } from '@/lib/services/secService';

interface SearchBoxProps {
  placeholder?: string;
  onSelectCompany?: (company: Company) => void;
}

export default function SearchBox({
  placeholder = 'Search by company name, ticker (e.g. AAPL, NVDA), or CIK...',
  onSelectCompany,
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length > 0) {
        const matched = await SECService.searchCompanies(query);
        setResults(matched);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (company: Company) => {
    setQuery(`${company.name} (${company.ticker})`);
    setIsOpen(false);
    if (onSelectCompany) {
      onSelectCompany(company);
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <form onSubmit={(e) => e.preventDefault()} className="search-box">
        <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search public companies by ticker or name"
          id="finscope-main-search"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown" role="listbox">
          {results.map((company) => (
            <div
              key={company.id}
              className="search-item"
              onClick={() => handleSelect(company)}
              role="option"
              aria-selected="false"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '0.4rem',
                    borderRadius: '6px',
                    color: 'var(--primary-500)',
                  }}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {company.name}{' '}
                    <span style={{ color: 'var(--primary-500)', marginLeft: '0.35rem' }}>({company.ticker})</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {company.sector} &bull; CIK: {company.cik}
                  </div>
                </div>
              </div>
              <a
                href={SECService.getEDGARFilingUrl(company.cik)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                title="View on SEC EDGAR"
              >
                SEC <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="search-dropdown" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No companies found matching &quot;{query}&quot;. Search by ticker like AAPL, MSFT, or NVDA.
        </div>
      )}
    </div>
  );
}

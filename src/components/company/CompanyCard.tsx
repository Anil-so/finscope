import { Company } from '@/types/company';
import { SECService } from '@/lib/services/secService';
import { ExternalLink, Building, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const edgarUrl = SECService.getEDGARFilingUrl(company.cik);

  return (
    <div className="glass-card company-card" id={`company-card-${company.id}`}>
      <div>
        <div className="company-card-header">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              {company.exchange}
            </span>
            <div className="company-ticker">{company.ticker}</div>
          </div>
          <span className="badge badge-emerald">SEC CIK: {company.cik}</span>
        </div>

        <h3 className="company-name">{company.name}</h3>
        <p className="company-desc">{company.description}</p>
      </div>

      <div>
        <div className="company-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building size={14} color="var(--primary-500)" /> {company.sector}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Globe size={14} color="var(--accent-purple)" /> {company.industry}
          </span>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <Link
            href={`/company/${company.ticker.toLowerCase()}`}
            className="search-button"
            style={{
              padding: '0.5rem 0.65rem',
              fontSize: '0.75rem',
              textDecoration: 'none',
              cursor: 'pointer',
              justifyContent: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            SEC Profile <ArrowRight size={14} />
          </Link>
          <a
            href={edgarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="badge badge-primary"
            style={{
              padding: '0.5rem 0.65rem',
              textTransform: 'none',
              fontSize: '0.75rem',
              textDecoration: 'none',
              cursor: 'pointer',
              justifyContent: 'center',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            EDGAR <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} />
          </a>
        </div>
      </div>
    </div>
  );
}

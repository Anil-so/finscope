'use client';

import { Company } from '@/types/company';
import CompanyGrid from '@/components/company/CompanyGrid';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';


interface PopularCompaniesProps {
  companies: Company[];
}

export default function PopularCompanies({ companies }: PopularCompaniesProps) {
  return (
    <section className="section" id="popular-companies-section">
      <div className="container">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Building2 size={18} color="var(--primary-500)" />
              <span className="badge badge-primary">Market Leaders</span>
            </div>
            <h2 className="section-title">Popular Companies</h2>
            <p className="section-subtitle">
              Explore key market capitalization leaders and their SEC Central Index Key (CIK) profiles.
            </p>
          </div>
          <Link
            href="/companies"
            style={{
              color: 'var(--primary-500)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            View All Companies <ArrowRight size={16} />
          </Link>
        </div>

        <CompanyGrid companies={companies} />
      </div>
    </section>
  );
}

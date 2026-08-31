import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SECService } from '@/lib/services/secService';
import CompanyProfileDashboard from '@/components/company/CompanyProfileDashboard';

interface PageProps {
  params: {
    ticker: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const symbol = params.ticker.toUpperCase();
  const company = await SECService.getCompanyBySymbol(symbol);

  if (!company) {
    return {
      title: 'Company Not Found | FinScope',
      description: 'The requested public company profile could not be located in FinScope.',
    };
  }

  const title = `${company.name} (${company.ticker}) Financial Data & SEC EDGAR Filings | FinScope`;
  const description = `Explore verified SEC EDGAR financial disclosures, revenue, net income, balance sheet assets, cash flows, and historical 10-K trends for ${company.name} (${company.ticker}).`;
  const url = `https://finscope.com/company/${company.ticker.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'FinScope',
      type: 'website',
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const symbol = params.ticker.toUpperCase();
  const company = await SECService.getCompanyBySymbol(symbol);

  if (!company) {
    notFound();
  }

  const companyUrl = `https://finscope.com/company/${company.ticker.toLowerCase()}`;

  const jsonLdCorporation = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: company.name,
    tickerSymbol: company.ticker,
    description: company.description,
    identifier: company.cik,
    url: companyUrl,
  };

  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://finscope.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Company Directory',
        item: 'https://finscope.com/companies',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${company.name} (${company.ticker})`,
        item: companyUrl,
      },
    ],
  };

  return (
    <div className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCorporation) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
        />
        <CompanyProfileDashboard company={company} />
      </div>
    </div>
  );
}

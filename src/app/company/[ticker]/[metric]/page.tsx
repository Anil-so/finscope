import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SECService } from '@/lib/services/secService';
import { METRIC_SLUG_MAP } from '@/types/sec';
import MetricDetailView from '@/components/company/MetricDetailView';

interface MetricPageProps {
  params: {
    ticker: string;
    metric: string;
  };
}

export async function generateMetadata({ params }: MetricPageProps): Promise<Metadata> {
  const metricSlug = params.metric.toLowerCase();
  const config = METRIC_SLUG_MAP[metricSlug];
  if (!config) return { title: 'Metric Not Found | FinScope' };

  const symbol = params.ticker.toUpperCase();
  const company = await SECService.getCompanyBySymbol(symbol);
  if (!company) return { title: 'Company Not Found | FinScope' };

  const title = `${company.name} (${company.ticker}) ${config.name} History & SEC Filings | FinScope`;
  const description = `View verified SEC EDGAR disclosures, ${config.name.toLowerCase()} history, annual 10-K trends, and official US-GAAP reporting for ${company.name} (${company.ticker}).`;
  const url = `https://finscope.com/company/${company.ticker.toLowerCase()}/${config.slug}`;

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

export default async function CompanyMetricPage({ params }: MetricPageProps) {
  const metricSlug = params.metric.toLowerCase();
  const config = METRIC_SLUG_MAP[metricSlug];

  if (!config) {
    notFound();
  }

  const symbol = params.ticker.toUpperCase();
  const company = await SECService.getCompanyBySymbol(symbol);

  if (!company) {
    notFound();
  }

  const payload = await SECService.getCompanyFactsPayload(company.cik);
  const metricData = payload.metrics[config.metricId];

  // Thin-Page & Missing-Data Guard:
  // Render subpage ONLY if underlying SEC XBRL fact is available
  if (!metricData || !metricData.isAvailable) {
    notFound();
  }

  let historyPoints = payload.history.revenue;
  if (config.metricId === 'net-income') {
    historyPoints = payload.history.netIncome;
  } else if (config.metricId !== 'revenue') {
    historyPoints = [];
  }

  const metricUrl = `https://finscope.com/company/${company.ticker.toLowerCase()}/${config.slug}`;
  const companyUrl = `https://finscope.com/company/${company.ticker.toLowerCase()}`;

  const jsonLdDataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${company.name} (${company.ticker}) ${config.name}`,
    description: config.description,
    identifier: `${company.cik}-${config.slug}`,
    license: 'https://www.sec.gov/about/open-government',
    creator: {
      '@type': 'Organization',
      name: 'U.S. Securities and Exchange Commission (SEC EDGAR)',
    },
    url: metricUrl,
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
      {
        '@type': 'ListItem',
        position: 4,
        name: config.name,
        item: metricUrl,
      },
    ],
  };

  return (
    <div className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
        />
        <MetricDetailView
          company={company}
          config={config}
          metric={metricData}
          historyPoints={historyPoints}
          allMetrics={payload.metrics}
        />
      </div>
    </div>
  );
}

/**
 * Data structures for SEC EDGAR XBRL API Integration.
 * Official SEC endpoint: https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit-cik}.json
 */

export interface SECRegistryEntry {
  cik: string;
  ticker: string;
  name: string;
}

export interface SECFactUnitValue {
  end?: string;
  start?: string;
  val: number;
  accn: string;
  fy: number;
  fp: string;
  form: string;
  filed: string;
  frame?: string;
}

export interface SECFactConcept {
  label: string;
  description?: string;
  units: Record<string, SECFactUnitValue[]>;
}

export interface SECCompanyFacts {
  cik: number;
  entityName: string;
  facts: {
    'us-gaap'?: Record<string, SECFactConcept>;
    'dei'?: Record<string, SECFactConcept>;
  };
}

export interface SECProcessedMetric {
  id: string;
  name: string;
  value: number | null;
  formattedValue: string;
  secTag: string;
  unit: string;
  period: string; // e.g. "FY 2024 (10-K)"
  filedDate: string;
  isAvailable: boolean;
}

export interface SECHistoricalPoint {
  label: string;
  year: number;
  val: number;
  formattedVal: string;
  filedDate: string;
  form: string;
}

export interface SECHistoricalData {
  revenue: SECHistoricalPoint[];
  netIncome: SECHistoricalPoint[];
}

export interface SECPaginatedCompanies {
  companies: import('@/types/company').Company[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SECMetricSlugConfig {
  slug: string;
  metricId: string;
  name: string;
  description: string;
  isRatio?: boolean;
}

export const METRIC_SLUG_MAP: Record<string, SECMetricSlugConfig> = {
  revenue: {
    slug: 'revenue',
    metricId: 'revenue',
    name: 'Revenue (Top-Line)',
    description: 'Total revenue earned from goods and services delivered during fiscal period.',
  },
  'net-income': {
    slug: 'net-income',
    metricId: 'net-income',
    name: 'Net Income (Bottom-Line)',
    description: 'Total profit remaining after deducting operating expenses, taxes, and interest.',
  },
  eps: {
    slug: 'eps',
    metricId: 'eps',
    name: 'Earnings Per Share (EPS)',
    description: 'Net income allocated to each outstanding share of common stock.',
    isRatio: true,
  },
  assets: {
    slug: 'assets',
    metricId: 'total-assets',
    name: 'Total Assets',
    description: 'Sum of all current and long-term economic resources owned by the company.',
  },
  liabilities: {
    slug: 'liabilities',
    metricId: 'total-debt',
    name: 'Total Debt / Liabilities',
    description: 'Total short-term and long-term debt obligations reported on balance sheet.',
  },
  cash: {
    slug: 'cash',
    metricId: 'cash',
    name: 'Cash & Cash Equivalents',
    description: 'Available liquid cash and short-term market investments.',
  },
  'cash-flow': {
    slug: 'cash-flow',
    metricId: 'operating-cash-flow',
    name: 'Operating Cash Flow',
    description: 'Net cash generated directly from primary business operations.',
  },
};

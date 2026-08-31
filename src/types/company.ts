export interface Company {
  id: string;
  name: string;
  ticker: string;
  cik: string; // SEC Central Index Key
  sector: string;
  industry: string;
  exchange: string;
  description: string;
  featured?: boolean;
}

export interface MetricDefinition {
  id: string;
  name: string;
  category: 'Income Statement' | 'Balance Sheet' | 'Cash Flow' | 'Key Ratios';
  description: string;
  importance: string;
  secTag: string; // Standardized US-GAAP XBRL tag reference
}

export interface FilingCategory {
  formType: '10-K' | '10-Q' | '8-K';
  title: string;
  description: string;
  frequency: string;
  importance: string;
}

export interface FinancialMetricPlaceholder {
  id: string;
  name: string;
  category: string;
  secTag: string;
  description: string;
  valueA?: string | number | null;
  valueB?: string | number | null;
}


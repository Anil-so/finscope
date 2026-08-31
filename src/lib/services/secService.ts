import { Company } from '@/types/company';
import { INITIAL_COMPANIES } from '@/lib/data/initialCompanies';
import {
  SECCompanyFacts,
  SECFactConcept,
  SECProcessedMetric,
  SECHistoricalData,
  SECHistoricalPoint,
  SECRegistryEntry,
  SECPaginatedCompanies,
} from '@/types/sec';

/**
 * Service Abstraction for SEC EDGAR API Integration.
 * Consumes official SEC EDGAR dataset (https://www.sec.gov/files/company_tickers.json)
 * and XBRL facts endpoints (https://data.sec.gov/api/xbrl/companyfacts/)
 */

const SEC_USER_AGENT = 'FinScope contact@finscope.com';
let cachedRegistry: SECRegistryEntry[] | null = null;
let registryFetchPromise: Promise<SECRegistryEntry[]> | null = null;

const METRIC_TAG_MAPPINGS: Record<string, { tags: string[]; name: string; isRatio?: boolean }> = {
  revenue: {
    tags: ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet'],
    name: 'Revenue (Top-Line)',
  },
  'net-income': {
    tags: ['NetIncomeLoss', 'ProfitLoss'],
    name: 'Net Income (Bottom-Line)',
  },
  'total-assets': {
    tags: ['Assets'],
    name: 'Total Assets',
  },
  'total-debt': {
    tags: ['Liabilities'],
    name: 'Total Debt / Liabilities',
  },
  cash: {
    tags: ['CashAndCashEquivalentsAtCarryingValue', 'CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
    name: 'Cash & Cash Equivalents',
  },
  'operating-cash-flow': {
    tags: ['NetCashProvidedByUsedInOperatingActivities'],
    name: 'Operating Cash Flow',
  },
  eps: {
    tags: ['EarningsPerShareBasic', 'EarningsPerShareDiluted'],
    name: 'Earnings Per Share (EPS)',
    isRatio: true,
  },
};

export class SECService {
  /**
   * Fetch official SEC company ticker dataset with 24-hour server caching
   */
  static async getSECRegistry(): Promise<SECRegistryEntry[]> {
    if (cachedRegistry && cachedRegistry.length > 0) {
      return cachedRegistry;
    }

    if (registryFetchPromise) {
      return registryFetchPromise;
    }

    registryFetchPromise = (async () => {
      try {
        const res = await fetch('https://www.sec.gov/files/company_tickers.json', {
          headers: {
            'User-Agent': SEC_USER_AGENT,
            'Accept-Encoding': 'gzip, deflate',
            Accept: 'application/json',
          },
          next: { revalidate: 86400 },
        });

        if (!res.ok) {
          console.warn(`Failed to fetch SEC registry, status: ${res.status}`);
          return this.getFallbackRegistry();
        }

        const rawData = await res.json();
        const entries = Object.values(rawData) as Array<{ cik_str: number; ticker: string; title: string }>;

        const uniqueMap = new Map<string, SECRegistryEntry>();

        entries.forEach((item) => {
          if (!item.ticker || !item.cik_str || !item.title) return;
          const cleanTicker = item.ticker.trim().toUpperCase();
          const cleanCik = item.cik_str.toString().padStart(10, '0');

          if (!uniqueMap.has(cleanTicker)) {
            uniqueMap.set(cleanTicker, {
              ticker: cleanTicker,
              cik: cleanCik,
              name: item.title.trim(),
            });
          }
        });

        const registryList = Array.from(uniqueMap.values());
        cachedRegistry = registryList;
        return registryList;
      } catch (error) {
        console.error('Error fetching SEC registry:', error);
        return this.getFallbackRegistry();
      } finally {
        registryFetchPromise = null;
      }
    })();

    return registryFetchPromise;
  }

  /**
   * Fallback registry using initial companies if SEC download fails
   */
  private static getFallbackRegistry(): SECRegistryEntry[] {
    return INITIAL_COMPANIES.map((c) => ({
      ticker: c.ticker,
      cik: c.cik,
      name: c.name,
    }));
  }

  /**
   * Fast multi-field search across 10,390+ official SEC companies with pagination
   */
  static async searchPaginatedCompanies(
    query = '',
    page = 1,
    limit = 24
  ): Promise<SECPaginatedCompanies> {
    const registry = await this.getSECRegistry();
    const normalized = query.trim().toLowerCase();

    let filtered = registry;

    if (normalized) {
      filtered = registry.filter((c) => {
        const matchTicker = c.ticker.toLowerCase().includes(normalized);
        const matchName = c.name.toLowerCase().includes(normalized);
        const matchCik = c.cik.includes(normalized);
        return matchTicker || matchName || matchCik;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (currentPage - 1) * limit;
    const sliced = filtered.slice(startIndex, startIndex + limit);

    const mappedCompanies: Company[] = sliced.map((entry) => {
      const known = INITIAL_COMPANIES.find((ic) => ic.ticker === entry.ticker);
      if (known) return known;

      return {
        id: entry.ticker.toLowerCase(),
        name: entry.name,
        ticker: entry.ticker,
        cik: entry.cik,
        sector: 'SEC Reporting Entity',
        industry: 'Public Corporation',
        exchange: 'SEC US',
        description: `Official SEC EDGAR registered public corporation (${entry.name}).`,
        featured: false,
      };
    });

    return {
      companies: mappedCompanies,
      total,
      page: currentPage,
      totalPages,
    };
  }

  /**
   * Search companies by query (backward compatibility)
   */
  static async searchCompanies(query: string): Promise<Company[]> {
    const result = await this.searchPaginatedCompanies(query, 1, 48);
    return result.companies;
  }

  /**
   * Get list of featured public companies.
   */
  static async getFeaturedCompanies(): Promise<Company[]> {
    return INITIAL_COMPANIES.filter((c) => c.featured);
  }

  /**
   * Get company metadata by ticker or CIK identifier from full 10,390+ SEC registry
   */
  static async getCompanyBySymbol(symbolOrCik: string): Promise<Company | null> {
    const normalized = symbolOrCik.trim().toLowerCase();

    const known = INITIAL_COMPANIES.find(
      (c) => c.ticker.toLowerCase() === normalized || c.cik.toLowerCase() === normalized || c.id === normalized
    );
    if (known) return known;

    const registry = await this.getSECRegistry();
    const entry = registry.find(
      (c) => c.ticker.toLowerCase() === normalized || c.cik.toLowerCase() === normalized
    );

    if (entry) {
      return {
        id: entry.ticker.toLowerCase(),
        name: entry.name,
        ticker: entry.ticker,
        cik: entry.cik,
        sector: 'SEC Reporting Entity',
        industry: 'Public Corporation',
        exchange: 'SEC US',
        description: `Official SEC EDGAR registered public corporation (${entry.name}).`,
        featured: false,
      };
    }

    return null;
  }

  /**
   * SEC EDGAR Submission URL builder (Official SEC reference URL)
   */
  static getEDGARFilingUrl(cik: string): string {
    const formattedCik = cik.padStart(10, '0');
    return `https://www.sec.gov/edgar/browse/?CIK=${formattedCik}`;
  }

  /**
   * Fetch raw Company Facts JSON from official SEC EDGAR API
   */
  static async fetchCompanyFacts(cik: string): Promise<SECCompanyFacts | null> {
    try {
      const formattedCik = cik.padStart(10, '0');
      const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${formattedCik}.json`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': SEC_USER_AGENT,
          'Accept-Encoding': 'gzip, deflate',
          Accept: 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.warn(`SEC API fetch failed for CIK ${cik} with status: ${res.status}`);
        return null;
      }

      const data: SECCompanyFacts = await res.json();
      return data;
    } catch (error) {
      console.error(`SEC API error for CIK ${cik}:`, error);
      return null;
    }
  }

  /**
   * Extract most recent annual (10-K) or quarterly (10-Q) fact value for a list of target XBRL tags
   */
  private static extractFactForTag(
    usGaapFacts: Record<string, SECFactConcept>,
    candidateTags: string[]
  ): { tagUsed: string; val: number; period: string; filed: string; unit: string } | null {
    for (const tag of candidateTags) {
      const concept = usGaapFacts[tag];
      if (!concept || !concept.units) continue;

      const unitKeys = Object.keys(concept.units);
      if (unitKeys.length === 0) continue;

      const primaryUnit = unitKeys[0];
      const items = concept.units[primaryUnit];
      if (!items || items.length === 0) continue;

      const tenKItems = items.filter((item) => item.form === '10-K');
      const candidatePool = tenKItems.length > 0 ? tenKItems : items;

      const sorted = [...candidatePool].sort((a, b) => {
        const dateA = a.end || a.filed || '0000-00-00';
        const dateB = b.end || b.filed || '0000-00-00';
        return dateB.localeCompare(dateA);
      });

      const latest = sorted[0];
      if (latest && typeof latest.val === 'number') {
        const periodStr = `FY ${latest.fy || ''} (${latest.form || 'SEC'})`;
        return {
          tagUsed: `us-gaap:${tag}`,
          val: latest.val,
          period: periodStr.trim(),
          filed: latest.filed || '',
          unit: primaryUnit,
        };
      }
    }

    return null;
  }

  /**
   * Extract multi-year historical annual financial points for targeted XBRL tags
   */
  private static extractHistoricalPoints(
    usGaapFacts: Record<string, SECFactConcept>,
    candidateTags: string[]
  ): SECHistoricalPoint[] {
    for (const tag of candidateTags) {
      const concept = usGaapFacts[tag];
      if (!concept || !concept.units) continue;

      const unitKey = Object.keys(concept.units)[0];
      const items = concept.units[unitKey];
      if (!items || items.length === 0) continue;

      const annuals = items.filter(
        (i) => i.form === '10-K' && typeof i.fy === 'number' && i.fp === 'FY'
      );

      const yearMap = new Map<number, (typeof items)[0]>();
      annuals.forEach((item) => {
        const existing = yearMap.get(item.fy);
        if (!existing || (item.filed && item.filed.localeCompare(existing.filed) > 0)) {
          yearMap.set(item.fy, item);
        }
      });

      const sorted = Array.from(yearMap.values())
        .sort((a, b) => a.fy - b.fy)
        .slice(-6);

      if (sorted.length > 0) {
        return sorted.map((item) => ({
          label: `FY ${item.fy}`,
          year: item.fy,
          val: item.val,
          formattedVal: this.formatMetricValue(item.val),
          filedDate: item.filed || '',
          form: item.form || '10-K',
        }));
      }
    }

    return [];
  }

  /**
   * Format numeric financial metric values into human-readable currency or ratio strings
   */
  static formatMetricValue(val: number, isRatio = false): string {
    if (val === null || val === undefined || isNaN(val)) return 'Not available';

    if (isRatio) {
      return `$${val.toFixed(2)} / share`;
    }

    const abs = Math.abs(val);
    const sign = val < 0 ? '-' : '';

    if (abs >= 1e12) {
      return `${sign}$${(abs / 1e12).toFixed(2)} Trillion`;
    }
    if (abs >= 1e9) {
      return `${sign}$${(abs / 1e9).toFixed(2)} Billion`;
    }
    if (abs >= 1e6) {
      return `${sign}$${(abs / 1e6).toFixed(2)} Million`;
    }
    if (abs >= 1e3) {
      return `${sign}$${(abs / 1e3).toFixed(2)} K`;
    }

    return `${sign}$${val.toLocaleString()}`;
  }

  /**
   * Process company facts for current 7 standard metrics and historical series
   */
  static async getCompanyFactsPayload(cik: string): Promise<{
    metrics: Record<string, SECProcessedMetric>;
    history: SECHistoricalData;
  }> {
    const rawData = await this.fetchCompanyFacts(cik);
    const metrics: Record<string, SECProcessedMetric> = {};

    const usGaap = rawData?.facts?.['us-gaap'] || {};

    for (const [metricId, config] of Object.entries(METRIC_TAG_MAPPINGS)) {
      const fact = this.extractFactForTag(usGaap, config.tags);

      if (fact) {
        metrics[metricId] = {
          id: metricId,
          name: config.name,
          value: fact.val,
          formattedValue: this.formatMetricValue(fact.val, config.isRatio),
          secTag: fact.tagUsed,
          unit: fact.unit,
          period: fact.period,
          filedDate: fact.filed,
          isAvailable: true,
        };
      } else {
        metrics[metricId] = {
          id: metricId,
          name: config.name,
          value: null,
          formattedValue: 'Not available',
          secTag: `us-gaap:${config.tags[0]}`,
          unit: 'USD',
          period: 'N/A',
          filedDate: 'N/A',
          isAvailable: false,
        };
      }
    }

    const history: SECHistoricalData = {
      revenue: this.extractHistoricalPoints(usGaap, METRIC_TAG_MAPPINGS.revenue.tags),
      netIncome: this.extractHistoricalPoints(usGaap, METRIC_TAG_MAPPINGS['net-income'].tags),
    };

    return { metrics, history };
  }

  /**
   * Process company facts for metrics (backward compatibility)
   */
  static async getCompanyMetrics(cik: string): Promise<Record<string, SECProcessedMetric>> {
    const payload = await this.getCompanyFactsPayload(cik);
    return payload.metrics;
  }
}

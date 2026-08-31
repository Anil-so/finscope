import { Metadata } from 'next';
import { SECService } from '@/lib/services/secService';
import CompanyDirectoryView from '@/components/company/CompanyDirectoryView';

export const metadata: Metadata = {
  title: 'Public Company Directory | FinScope',
  description: 'Search and browse 10,390+ U.S. SEC EDGAR registered public corporations, Central Index Keys (CIK), and live financial disclosures.',
};

export default async function CompaniesPage() {
  const initialData = await SECService.searchPaginatedCompanies('', 1, 24);

  return (
    <div className="section">
      <div className="container">
        <CompanyDirectoryView
          initialCompanies={initialData.companies}
          initialTotal={initialData.total}
          initialTotalPages={initialData.totalPages}
        />
      </div>
    </div>
  );
}

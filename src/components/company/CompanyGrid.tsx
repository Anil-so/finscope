import { Company } from '@/types/company';
import CompanyCard from './CompanyCard';

interface CompanyGridProps {
  companies: Company[];
}

export default function CompanyGrid({ companies }: CompanyGridProps) {
  return (
    <div className="company-grid" id="popular-companies-grid">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}

import { SECService } from '@/lib/services/secService';
import HeroSection from '@/components/sections/HeroSection';
import PopularCompanies from '@/components/sections/PopularCompanies';
import LatestDataSection from '@/components/sections/LatestDataSection';
import CompareSection from '@/components/sections/CompareSection';
import MetricsSection from '@/components/sections/MetricsSection';

export default async function HomePage() {
  const featuredCompanies = await SECService.getFeaturedCompanies();

  return (
    <>
      <HeroSection />
      <PopularCompanies companies={featuredCompanies} />
      <LatestDataSection />
      <CompareSection />
      <MetricsSection />
    </>
  );
}

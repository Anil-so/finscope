import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://finscope.com'),
  title: 'FinScope | Financial Data. Made Simple.',
  description:
    'FinScope provides simple, clean, and un-biased financial information for publicly traded companies using official U.S. SEC EDGAR disclosures.',
  keywords: [
    'Financial Data',
    'SEC EDGAR',
    'Public Companies',
    'Company Filings',
    '10-K',
    '10-Q',
    'Financial Metrics',
    'FinScope',
    'Stock Analysis',
  ],
  authors: [{ name: 'FinScope Team' }],
  openGraph: {
    title: 'FinScope | Financial Data. Made Simple.',
    description:
      'Simple, transparent financial data for publicly traded companies powered by SEC EDGAR reporting.',
    url: 'https://finscope.com',
    siteName: 'FinScope',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinScope | Financial Data. Made Simple.',
    description:
      'Simple, transparent financial data for publicly traded companies powered by SEC EDGAR reporting.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

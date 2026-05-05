import { LandingPage } from '@/components/landing/LandingPage';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WhoUnfollowed',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://whounfollowed.app',
  description:
    "Privacy-first Instagram follower analysis. Upload your data export, see who unfollowed you, who doesn't follow back, and track changes over time. Nothing leaves your browser.",
  offers: [
    { '@type': 'Offer', name: 'Free',    price: '0',    priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro',     price: '4.99', priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Desktop', price: '19',   priceCurrency: 'USD' },
  ],
  featureList: [
    'No Instagram password required',
    'Client-side processing. Data never leaves your browser.',
    'Follower diff and comparison',
    'CSV export',
    'Open-source parsing core (MIT)',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}

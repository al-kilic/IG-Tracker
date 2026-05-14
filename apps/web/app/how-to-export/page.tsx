import type { Metadata } from 'next';
import { HowToExportContent } from './HowToExportContent';

export const metadata: Metadata = {
  title: 'How to Export Instagram Followers & Following Data — Step-by-Step Guide (2026)',
  description: 'Step-by-step guide to downloading your Instagram followers and following list as a ZIP. Takes under 5 minutes. No third-party app, no password needed.',
  alternates: {
    canonical: 'https://whounfollowed.app/how-to-export',
  },
  openGraph: {
    title: 'How to Export Instagram Followers & Following Data — Step-by-Step Guide (2026)',
    description: 'Step-by-step guide to downloading your Instagram followers and following list as a ZIP. Takes under 5 minutes. No third-party app, no password needed.',
    url: 'https://whounfollowed.app/how-to-export',
  },
};

const faqItems = [
  {
    question: 'Does requesting an Instagram data export notify my followers?',
    answer: 'No. The export is completely private. Your followers have no way of knowing you requested or downloaded your data.',
  },
  {
    question: 'How often can I request an Instagram data export?',
    answer: 'Instagram allows one export request approximately every 14 days per account.',
  },
  {
    question: 'Is it safe to request my Instagram data export?',
    answer: 'Yes. It is an official Instagram feature required under GDPR. No third-party app is involved at any point.',
  },
  {
    question: 'What format should I choose — JSON or HTML?',
    answer: 'Always choose JSON. It includes timestamps showing when each person followed you, and it\'s the format our parser is built for. HTML is only for human reading and contains less data.',
  },
  {
    question: 'Can I request an Instagram data export on desktop?',
    answer: 'Yes. Go to accountscenter.instagram.com → Your information and permissions → Export your information. The process is identical to mobile.',
  },
  {
    question: 'Why do I only need the Followers and Following export, not my full archive?',
    answer: 'The full Instagram archive can be several gigabytes and takes much longer. Followers and Following is a small, focused export — usually under 1MB — and ready in minutes.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function HowToExportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HowToExportContent />
    </>
  );
}

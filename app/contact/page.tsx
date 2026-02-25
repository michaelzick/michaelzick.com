import type { Metadata } from 'next';
import ContactContent from './ContactContent';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Michael Zick | Contact',
  description:
    'Connect with Michael Zick for a free Nice Guy recovery consultation. Start your journey toward self-led masculinity and internal authority.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Michael Zick | Contact',
    description:
      'Connect with Michael Zick for a free Nice Guy recovery consultation. Start your journey toward self-led masculinity and internal authority.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/img/lake_reflection_2500.webp',
        alt: 'Lake reflection at dusk',
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Contact',
    description:
      'Connect with Michael Zick for a free Nice Guy recovery consultation. Start your journey toward self-led masculinity and internal authority.',
    images: ['/img/lake_reflection_2500.webp'],
  },
};

export default function Contact() {
  return <ContactContent />;
}

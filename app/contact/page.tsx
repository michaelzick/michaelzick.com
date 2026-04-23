import type { Metadata } from 'next';
import ContactContent from './ContactContent';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Book a Free Nice Guy Recovery Session | Michael Zick',
  description:
    'Book a free 45-minute session with Michael Zick to name the approval loop, identify the next honest move, and explore Nice Guy Recovery coaching.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Book a Free Nice Guy Recovery Session | Michael Zick',
    description:
      'Book a free 45-minute session with Michael Zick to name the approval loop, identify the next honest move, and explore Nice Guy Recovery coaching.',
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
    title: 'Book a Free Nice Guy Recovery Session | Michael Zick',
    description:
      'Book a free 45-minute session with Michael Zick to name the approval loop, identify the next honest move, and explore Nice Guy Recovery coaching.',
    images: ['/img/lake_reflection_2500.webp'],
  },
};

export default function Contact() {
  return <ContactContent />;
}

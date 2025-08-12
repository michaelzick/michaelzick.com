import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Michael Zick | Contact',
  description:
    'Get in touch with Michael Zick for coaching inquiries and strategy sessions.',
  openGraph: {
    title: 'Michael Zick | Contact',
    description:
      'Get in touch with Michael Zick for coaching inquiries and strategy sessions.',
    url: 'https://michaelzick.com/contact',
    siteName: 'Michael Zick',
    images: [
      {
        url: 'https://michaelzick.com/img/lake_reflection_2500.webp',
        alt: 'Lake reflection at dusk',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Contact',
    description:
      'Get in touch with Michael Zick for coaching inquiries and strategy sessions.',
    images: ['https://michaelzick.com/img/lake_reflection_2500.webp'],
  },
};

export default function Contact() {
  return <ContactContent />;
}


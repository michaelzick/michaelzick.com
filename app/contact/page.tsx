import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Michael Zick | Contact',
  description:
    'Helping high-functioning adults separate fear and anxiety from reality.',
  openGraph: {
    title: 'Michael Zick | Contact',
    description:
      'Helping high-functioning adults separate fear and anxiety from reality.',
    url: 'https://www.michaelzick.com/contact',
    siteName: 'Michael Zick | Reality Alignment Coach',
    images: [
      {
        url: 'https://www.michaelzick.com/img/lake_reflection_2500.webp',
        alt: 'Lake reflection at dusk',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Contact',
    description:
      'Helping high-functioning adults separate fear and anxiety from reality.',
    images: ['https://www.michaelzick.com/img/lake_reflection_2500.webp'],
  },
};

export default function Contact() {
  return <ContactContent />;
}

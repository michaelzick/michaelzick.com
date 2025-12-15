import type { Metadata } from 'next'
import HomePageContent from '../components/HomePageContent'

export const metadata: Metadata = {
  title: 'Michael Zick | Reality Alignment Coach',
  description:
    'Helping high-functioning adults separate fear and anxiety from reality.',
  openGraph: {
    title: 'Michael Zick | Reality Alignment Coach',
    description:
      'Helping high-functioning adults separate fear and anxiety from reality.',
    url: 'https://www.michaelzick.com',
    siteName: 'Michael Zick',
    images: [
      {
        url: '/img/homepage_mountains.webp',
        alt: 'Mountain landscape at sunset',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Reality Alignment Coach',
    description:
      'Helping high-functioning adults separate fear and anxiety from reality.',
    images: [
      '/img/homepage_mountains.webp',
    ],
  },
}

export default function Home() {
  return <HomePageContent />
}

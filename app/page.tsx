import type { Metadata } from 'next'
import HomePageContent from '../components/HomePageContent'

export const metadata: Metadata = {
  title: 'Michael Zick | Reality Alignment Coach',
  description:
    'Los Angeles-based Reality Alignment Coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
  openGraph: {
    title: 'Michael Zick | Reality Alignment Coach',
    description:
      'Los Angeles-based Reality Alignment Coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
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
      'Los Angeles-based Reality Alignment Coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
    images: [
      '/img/homepage_mountains.webp',
    ],
  },
}

export default function Home() {
  return <HomePageContent />
}

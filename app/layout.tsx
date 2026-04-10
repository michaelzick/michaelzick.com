import './globals.css';
import type { Metadata } from 'next';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import SiteAnalyticsScripts from '../components/SiteAnalyticsScripts';
import { Open_Sans } from 'next/font/google';
import { siteConfig } from '../lib/site';
import { getSiteStructuredData } from '../lib/site-structured-data';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
});

const structuredData = getSiteStructuredData();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.shortName, url: siteConfig.url }],
  creator: siteConfig.shortName,
  publisher: siteConfig.businessName,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: siteConfig.defaultImage,
        alt: 'Mountain landscape at sunset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.defaultImage],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '64x64' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    'geo.region': siteConfig.region,
    'geo.placename': siteConfig.placename,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang={siteConfig.locale.replace('_', '-')} suppressHydrationWarning>
      <head>
        <JsonLd data={structuredData} />
        <SiteAnalyticsScripts />
      </head>
      <body className={`${openSans.variable} min-h-screen flex flex-col font-sans`}>
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Script from 'next/script';
import { Open_Sans } from 'next/font/google';
import { siteConfig } from '../lib/site';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
});

const [countryCode, regionCode] = siteConfig.region.split('-');

const organizationAddress = {
  '@type': 'PostalAddress',
  addressLocality: siteConfig.placename,
  ...(regionCode ? { addressRegion: regionCode } : {}),
  ...(countryCode ? { addressCountry: countryCode } : {}),
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.businessName,
      url: siteConfig.url,
      description: siteConfig.description,
      address: organizationAddress,
      areaServed: {
        '@type': 'City',
        name: siteConfig.placename,
      },
      sameAs: siteConfig.sameAs,
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.shortName,
      jobTitle: 'Reality Alignment Coach',
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.personImage}`,
      worksFor: {
        '@id': `${siteConfig.url}/#organization`,
      },
      sameAs: siteConfig.sameAs,
    },
  ],
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.locale.replace('_', '-')}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QK4WD4TRZV"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QK4WD4TRZV');
          `}
        </Script>
      </head>
      <body className={`${openSans.variable} min-h-screen flex flex-col font-sans`}>
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="text-white py-8 text-lg bg-dark-blue">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <p>Michael Zick | Reality Alignment Coach</p>
            </div>
            <div className="md:col-span-6 md:col-start-6 md:text-right space-y-2">
              <Link href="/about" className="footer-link inline-block">
                About
              </Link>
              <br />
              <Link href="/testimonials" className="footer-link inline-block">
                Testimonials
              </Link>
              <br />
              <Link href="/contact" className="footer-link inline-block">
                Contact
              </Link>
              <br />
              <a
                href="https://calendly.com/michaelzick/45min"
                target="_blank"
                className="footer-link inline-block"
              >
                <strong>Book a Free Session</strong>
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/20 pt-4 text-sm">
            <div className="px-6 md:px-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p>
                Site designed and built by{' '}
                <a
                  href="https://www.zickonezero.com"
                  target="_blank"
                  className="footer-link inline-block"
                >
                  ZICKONEZERO Creative
                </a>
              </p>
              <p className="md:text-right">© 2025 Michael Zick Coaching</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

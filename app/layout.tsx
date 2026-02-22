import './globals.css';
import type { Metadata } from 'next';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
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
      jobTitle: 'Nice Guy Recovery Coach',
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

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang={siteConfig.locale.replace('_', '-')} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Amplitude Browser SDK + Session Replay */}
        <Script
          strategy="afterInteractive"
          src="https://cdn.amplitude.com/script/46e4589d8bee602239bf1937b465e1d7.js"
        />
        <Script id="amplitude-init" strategy="afterInteractive">
          {`
            (function () {
              var start = Date.now();
              var maxWaitMs = 8000;

              function tryInit() {
                if (window.__amplitudeInitialized) return;
                if (!window.amplitude || !window.amplitude.init) {
                  if (Date.now() - start < maxWaitMs) {
                    setTimeout(tryInit, 100);
                  }
                  return;
                }

                if (window.sessionReplay && window.sessionReplay.plugin && window.amplitude.add) {
                  window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
                }

                window.amplitude.init('46e4589d8bee602239bf1937b465e1d7', {
                  fetchRemoteConfig: true,
                  autocapture: true,
                });
                window.__amplitudeInitialized = true;
              }

              tryInit();
            })();
          `}
        </Script>
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
        <Footer />
      </body>
    </html>
  );
}

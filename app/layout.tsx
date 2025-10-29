import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Michael Zick | Peak Performance Coach',
  description:
    'Los Angeles-based peak performance coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
  openGraph: {
    title: 'Michael Zick | Peak Performance Coach',
    description:
      'Los Angeles-based peak performance coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
    url: 'https://www.michaelzick.com',
    siteName: 'Michael Zick',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Peak Performance Coach',
    description:
      'Los Angeles-based peak performance coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
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
      <body className="min-h-screen flex flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="text-white py-8 text-lg bg-dark-blue">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <p>Michael Zick Coaching | Peak Performance Coach</p>
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
        </footer>
      </body>
    </html>
  );
}

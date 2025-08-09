import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '../components/NavBar'

export const metadata: Metadata = {
  title: 'Michael Zick | Peak Performance Coach',
  description: "I'm a Los Angeles-based certified life and relationship coach, helping individuals level up and relate powerfully.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="bg-black text-white py-8 text-lg bg-dark-blue">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <p>Michael Zick Coaching | Peak Performance Coach</p>
            </div>
            <div className="md:col-span-6 md:col-start-6 md:text-right space-y-2">
              <a
                href="https://link.michaelzick.com/45min"
                target="_blank"
                className="block"
              >
                <strong>Book a Free 45-Minute Strategy Session</strong>
              </a>
              <Link href="/work-with-me" className="block">
                Work With Me
              </Link>
              <Link href="/testimonials" className="block">
                Testimonials
              </Link>
              <Link href="/about" className="block">
                About
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

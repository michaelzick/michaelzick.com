import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['300'] })

export const metadata: Metadata = {
  title: 'Michael Zick | Peak Performance Coach',
  description: "I'm a Los Angeles-based certified life and relationship coach, helping individuals level up and relate powerfully.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <header className="fixed top-0 w-full z-50 px-[70px] bg-transparent">
          <nav className="flex w-full items-center justify-between py-4 text-white">
            <Link href="/" className="nav-link text-[32px]">Michael Zick</Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/work-with-me" className="nav-link">Work With Me</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/testimonials" className="nav-link">Testimonials</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </div>
            <a
              href="https://www.zickonezero.com/"
              className="btn nav-link border-white"
              target="_blank"
            >
              Product Management
            </a>
          </nav>
        </header>
        <main className="flex-1 pt-20">{children}</main>
        <footer className="bg-black text-white py-8">
          <div className="max-w-screen-xl mx-auto text-center space-y-4 text-sm">
            <p>Michael Zick Coaching | Peak Performance Coach</p>
            <div className="flex justify-center space-x-4">
              <Link href="/work-with-me">Work With Me</Link>
              <Link href="/testimonials">Testimonials</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

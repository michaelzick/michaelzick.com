import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Poppins } from 'next/font/google'
import NavBar from '../components/NavBar'

const poppins = Poppins({ subsets: ['latin'], weight: ['300'] })

export const metadata: Metadata = {
  title: 'Michael Zick | Peak Performance Coach',
  description: "I'm a Los Angeles-based certified life and relationship coach, helping individuals level up and relate powerfully.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <NavBar />
        <main className="flex-1">{children}</main>
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

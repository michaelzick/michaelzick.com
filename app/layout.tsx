import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Michael Zick | Peak Performance Coach',
  description: "I'm a Los Angeles-based certified life and relationship coach, helping individuals level up and relate powerfully.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur z-50">
          <nav className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="font-medium">Michael Zick</Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/work-with-me">Work With Me</Link>
              <Link href="/about">About</Link>
              <Link href="/testimonials">Testimonials</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <a href="https://www.zickonezero.com/" className="btn" target="_blank">Product Management</a>
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

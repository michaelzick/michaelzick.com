'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 px-[70px] max-[929px]:px-[30px] transition-all duration-500 ${
        scrolled
          ? 'bg-dark-blue/70 backdrop-blur-md'
          : 'bg-transparent backdrop-blur-0'
      }`}
    >
      <nav
        className={`relative z-50 flex w-full items-center justify-between text-white transition-all duration-500 ${
          scrolled ? 'py-4' : 'py-8'
        }`}
      >
        <Link href="/" className={`${menuOpen ? '!text-default-grey' : ''}`}>
          <h1
            className={`font-bold transition-all duration-500 ${
              scrolled ? 'text-[40px]' : 'text-[48px]'
            }`}
          >
            Michael Zick
          </h1>
        </Link>
        <div className="nav-links-container flex space-x-6">
          <Link
            href="/work-with-me"
            className={`nav-link text-2xl ${
              pathname === '/work-with-me' ? 'active' : ''
            }`}
          >
            Work With Me
          </Link>
          <Link
            href="/about"
            className={`nav-link text-2xl ${
              pathname === '/about' ? 'active' : ''
            }`}
          >
            About
          </Link>
          <Link
            href="/testimonials"
            className={`nav-link text-2xl ${
              pathname === '/testimonials' ? 'active' : ''
            }`}
          >
            Testimonials
          </Link>
          <Link
            href="/contact"
            className={`nav-link text-2xl ${
              pathname === '/contact' ? 'active' : ''
            }`}
          >
            Contact
          </Link>
        </div>
        <div
          className="header-burger menu-overlay-has-visible-non-navigation-items"
          data-animation-role="header-element"
        >
          <button
            className="header-burger-btn burger"
            data-test="header-burger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="burger-box">
              <div
                className={`burger-inner header-menu-icon-doubleLineHamburger ${
                  menuOpen ? 'open' : ''
                }`}
              >
                <div className="top-bun"></div>
                <div className="bottom-bun"></div>
              </div>
            </div>
          </button>
        </div>
      </nav>
      <div
        className={`fixed inset-0 bg-white text-default-grey z-40 flex flex-col items-end justify-center space-y-6 p-8 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <Link
          href="/work-with-me"
          className={`nav-link text-default-grey ${
            pathname === '/work-with-me' ? 'active' : ''
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Work With Me
        </Link>
        <Link
          href="/about"
          className={`nav-link text-default-grey ${
            pathname === '/about' ? 'active' : ''
          }`}
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/testimonials"
          className={`nav-link text-default-grey ${
            pathname === '/testimonials' ? 'active' : ''
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Testimonials
        </Link>
        <Link
          href="/contact"
          className={`nav-link text-default-grey ${
            pathname === '/contact' ? 'active' : ''
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>
      </div>
    </header>
  )
}

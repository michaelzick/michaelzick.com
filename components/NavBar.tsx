'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 px-[70px] max-[929px]:px-[30px] transition-colors duration-500 ${
        scrolled ? 'bg-[var(--default-grey)]' : 'bg-transparent'
      }`}
    >
      <nav className="relative z-50 flex w-full items-center justify-between py-4 text-white">
        <Link
          href="/"
          className={`nav-link text-[32px] ${menuOpen ? '!text-[var(--default-grey)]' : ''}`}
        >
          Michael Zick
        </Link>
        <div className="nav-links-container flex space-x-6">
          <Link href="/work-with-me" className="nav-link">
            Work With Me
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/testimonials" className="nav-link">
            Testimonials
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>
        <a
          href="https://www.zickonezero.com/"
          className="nav-button btn nav-link border-white"
          target="_blank"
        >
          Product Management
        </a>
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
        className={`fixed inset-0 bg-white text-[var(--default-grey)] z-40 flex flex-col items-end justify-center space-y-6 p-8 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <Link
          href="/work-with-me"
          className="nav-link text-[var(--default-grey)]"
          onClick={() => setMenuOpen(false)}
        >
          Work With Me
        </Link>
        <Link
          href="/about"
          className="nav-link text-[var(--default-grey)]"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/testimonials"
          className="nav-link text-[var(--default-grey)]"
          onClick={() => setMenuOpen(false)}
        >
          Testimonials
        </Link>
        <Link
          href="/contact"
          className="nav-link text-[var(--default-grey)]"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>
        <a
          href="https://www.zickonezero.com/"
          className="nav-link btn border-[var(--default-grey)] text-[var(--default-grey)] hover:bg-[var(--default-grey)] hover:text-white"
          target="_blank"
          onClick={() => setMenuOpen(false)}
        >
          Product Management
        </a>
      </div>
    </header>
  )
}


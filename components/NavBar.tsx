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
      className={`fixed top-0 w-full z-50 px-[70px] transition-colors duration-500 ${
        scrolled ? 'bg-[var(--dark-blue)]' : 'bg-transparent'
      }`}
    >
      <nav className="flex w-full items-center justify-between py-4 text-white">
        <Link href="/" className="nav-link text-[32px]">
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
            <span
              className="js-header-burger-open-title visually-hidden"
              hidden={menuOpen}
            >
              Open Menu
            </span>
            <span
              className="js-header-burger-close-title visually-hidden"
              hidden={!menuOpen}
            >
              Close Menu
            </span>
            <div className="burger-box">
              <div className="burger-inner header-menu-icon-doubleLineHamburger">
                <div className="top-bun"></div>
                <div className="patty"></div>
                <div className="bottom-bun"></div>
              </div>
            </div>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="header-menu-nav">
          <nav className="header-menu-nav-list">
            <div
              data-folder="root"
              className="header-menu-nav-folder header-menu-nav-folder--active"
            >
              <div className="header-menu-nav-folder-content">
                <div className="header-menu-nav-wrapper">
                  <div className="container header-menu-nav-item header-menu-nav-item--collection">
                    <Link href="/work-with-me">
                      <div className="header-menu-nav-item-content">
                        Work With Me
                      </div>
                    </Link>
                  </div>
                  <div className="container header-menu-nav-item header-menu-nav-item--collection">
                    <Link href="/about">
                      <div className="header-menu-nav-item-content">About</div>
                    </Link>
                  </div>
                  <div className="container header-menu-nav-item header-menu-nav-item--collection">
                    <Link href="/testimonials">
                      <div className="header-menu-nav-item-content">
                        Testimonials
                      </div>
                    </Link>
                  </div>
                  <div className="container header-menu-nav-item header-menu-nav-item--collection">
                    <Link href="/contact">
                      <div className="header-menu-nav-item-content">Contact</div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="header-menu-cta">
                <a
                  className="theme-btn--primary btn sqs-button-element--primary"
                  href="https://www.zickonezero.com/"
                  target="_blank"
                >
                  Product Management
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}


'use client';

interface BurgerButtonProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function BurgerButton({ menuOpen, setMenuOpen }: BurgerButtonProps) {
  return (
    <div
      className="header-burger menu-overlay-has-visible-non-navigation-items"
      data-animation-role="header-element"
    >
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        className="header-burger-btn burger pointer-events-auto hidden h-11 w-11 items-center justify-center max-[929px]:inline-flex"
        data-test="header-burger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="burger-box">
          <div
            className={`burger-inner header-menu-icon-doubleLineHamburger ${menuOpen ? 'open' : ''
              }`}
          >
            <div className="top-bun"></div>
            <div className="bottom-bun"></div>
          </div>
        </div>
      </button>
    </div>
  );
}

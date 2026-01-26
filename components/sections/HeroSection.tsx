import Link from 'next/link';
import TrackedCtaLink from '../TrackedCtaLink';


export function HeroSection() {
  return (
    <section
      className="relative flex h-screen items-end text-white"
      style={{
        backgroundImage: "url('/img/homepage_mountains.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
      <div className="relative w-full max-w-[1400px] mx-auto p-8 flex flex-col items-start">
        <h1 className="text-4xl md:text-6xl text-left mb-8">
          You don&apos;t need more information.<br />You need more <em>implementation.</em>
        </h1>
        <div className="mt-4 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <TrackedCtaLink
            href="https://calendly.com/michaelzick/45min"
            className="btn text-xl"
            location="hero"
            label="Book a Free Session"
          >
            Book a Free Session
          </TrackedCtaLink>
          <TrackedCtaLink
            href="/questionnaire"
            className="rainbow-glass-btn"
            location="hero"
            label="Take the Questionnaire"
            target="_self"
          >
            Take the Questionnaire
          </TrackedCtaLink>
        </div>
      </div>
    </section>
  );
}

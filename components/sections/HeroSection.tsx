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
      <div className="relative w-full max-w-[1400px] mx-auto p-8 flex flex-col items-end">
        <h1 className="text-4xl md:text-6xl text-right mb-8">
          You Don&apos;t Need More Information.<br />You Need More Implementation.
        </h1>
        <TrackedCtaLink
          href="https://calendly.com/michaelzick/45min"
          className="rainbow-glass-btn"
          location="hero"
          label="Take the First Step"
        >
          Take the First Step
        </TrackedCtaLink>
      </div>
    </section>
  );
}

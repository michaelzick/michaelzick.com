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
            href="/questionnaire"
            className="rainbow-glass-btn cta-unified"
            location="hero"
            label="Start Here"
            target="_self"
          >
            Start Here
          </TrackedCtaLink>
        </div>
      </div>
    </section>
  );
}

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
        <h1 className="text-5xl md:text-7xl text-left mb-6 font-headline font-bold drop-shadow-md">
          Nice Guy Recovery Coach
        </h1>
        <p className="text-2xl md:text-[36px] text-left mb-10 max-w-[800px] font-medium leading-relaxed drop-shadow-sm text-white/90">
          Break the addiction to approval.
        </p>
        <div className="mt-2 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <TrackedCtaLink
            href="/questionnaire"
            className="rainbow-glass-btn cta-unified"
            location="hero"
            label="Start Here"
            eventName="questionnaire_click"
            target="_self"
          >
            Start Here
          </TrackedCtaLink>
        </div>
      </div>
    </section>
  );
}

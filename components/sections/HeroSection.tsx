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
      <div className="w-full max-w-[1400px] mx-auto p-8">
        <h2 className="text-4xl md:text-6xl text-right">Peak Performance Coach</h2>
      </div>
    </section>
  );
}

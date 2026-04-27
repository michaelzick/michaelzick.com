import Image from 'next/image';
import BookingCta from '../BookingCta';
import QuestionnaireCta from '../QuestionnaireCta';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-end text-white">
      <Image
        src="/img/homepage_mountains.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
      <div className="relative w-full max-w-[1400px] mx-auto px-8 pb-8 pt-40 min-[930px]:pt-8 flex flex-col items-start">
        <h1 className="text-4xl sm:text-5xl md:text-7xl text-left mb-6 font-headline font-bold drop-shadow-md">
          Stop Performing for Approval.<br />Start Leading Your Life.
        </h1>
        <p className="text-2xl md:text-[36px] text-left mb-10 max-w-[1000px] font-medium leading-relaxed drop-shadow-sm text-white/90">
          Certified coaching to reclaim your internal authority.
        </p>
        <div className="mt-2 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <BookingCta location="hero" />
          <QuestionnaireCta location="hero" />
        </div>
        <p className="mt-6 text-sm font-medium text-white/70 drop-shadow-sm">
          Certified by Dr. Robert Glover, author of <em>No More Mr. Nice Guy</em>
        </p>
      </div>
    </section>
  );
}

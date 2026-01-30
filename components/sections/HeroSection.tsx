import Link from 'next/link';
import Image from 'next/image';
import TrackedCtaLink from '../TrackedCtaLink';
import QuestionnaireCta from '../QuestionnaireCta';
import BookingCta from '../BookingCta';


export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-end text-white pb-12 pt-24 md:pb-0 md:pt-0"
      style={{
        backgroundImage: "url('/img/homepage_mountains.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
      <div className="relative w-full max-w-[1400px] mx-auto p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        <div className="flex flex-col items-start w-full md:w-1/2 z-10">
          <h1 className="text-4xl md:text-6xl text-left mb-8 font-bold leading-tight">
            You don&apos;t need more information.<br />You need more <em>implementation.</em>
          </h1>
          <div className="mt-4 flex flex-col items-start gap-4 md:flex-row md:items-center">
            <BookingCta location="hero" />
            <QuestionnaireCta location="hero" />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10 mt-8 md:mt-0">
          <Image
            src="/img/michael-black-bg.webp"
            alt="Michael Zick"
            width={800}
            height={1200}
            className="w-full max-w-[230px] md:max-w-[400px] h-auto object-contain drop-shadow-2xl rounded-xl"
            priority
            sizes="(max-width: 768px) 50vw, 30vw"
          />
        </div>
      </div>
    </section>
  );
}

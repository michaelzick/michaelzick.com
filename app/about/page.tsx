import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeInSection } from '../../components/FadeInSection';
import TrackedCtaLink from '../../components/TrackedCtaLink';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Michael Zick | About',
  description:
    'Learn about Michael Zick, a reality alignment coach established in the Los Angeles mental health and recovery community since 2015.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Michael Zick | About',
    description:
      'Learn about Michael Zick, a reality alignment coach established in the Los Angeles mental health and recovery community since 2015.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/img/ocean_2500.webp',
        alt: 'Ocean shoreline at dusk',
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | About',
    description:
      'Learn about Michael Zick, a reality alignment coach established in the Los Angeles mental health and recovery community since 2015.',
    images: ['/img/ocean_2500.webp'],
  },
};

export default function About() {
  const credentials = [
    'Certified by Dr. Robert Glover, author of "No More Mr. Nice Guy" and renowned therapist.',
    'Certified as a Life & Relationship Coach by Life Purpose Institute.',
    'Established in the Los Angeles mental health and recovery community since 2015.',
  ];

  return (
    <div className="flex flex-col">
      <section className="px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <FadeInSection className="mb-10 text-center md:text-left">
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
              About Michael
            </h1>
          </FadeInSection>
          <div className="space-y-24 md:space-y-32">
            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 space-y-6 order-2 md:order-1">
                <h2 className="text-[45px] font-semibold">Get into action.</h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      Michael stands by the phrase, &quot;We don&apos;t think our way into right action; we act our
                      way into right thinking.&quot; In other words, replacing worrying with doing is the
                      path to success that Michael encourages, and his clients have the results to show
                      for it.
                    </p>
                    <p className="text-[23px]">
                      He has worked with the best of the best — from top business and marketing
                      coaches to world-renowned relationship experts like Dr. Glover and Erwan and
                      Alicia Davon.
                    </p>
                    <p className="text-[23px]">
                      With his no-BS approach, those who work with Michael will know what it&apos;s like to
                      replace rumination with action, take ownership of their thoughts, feelings, and
                      behaviors, stop being a victim, and play well with others without being &quot;nice.&quot;
                    </p>
                  </div>
                  <TrackedCtaLink
                    href="https://calendly.com/michaelzick/45min"
                    className="btn mt-6 text-xl"
                    location="about"
                  >
                    Book a Free Session
                  </TrackedCtaLink>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <Image
                  src="/img/blue_jacket.webp"
                  alt="Michael wearing a jacket"
                  width={2500}
                  height={3124}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
            </FadeInSection>
            <FadeInSection>
              <ul className="list-none border-t border-default-grey/30 p-0">
                {credentials.map((item, index) => {
                  const itemNumber = String(index + 1).padStart(2, '0');
                  return (
                    <li
                      key={item}
                      className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-default-grey/20 py-7 md:py-8"
                    >
                      <span className="mt-2 font-mono text-xs font-semibold tracking-[0.35em] text-default-grey/70">
                        {itemNumber}
                      </span>
                      <p className="text-[26px] font-semibold leading-snug text-default-grey md:text-[30px]">
                        {item}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </FadeInSection>
            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 space-y-6 order-2 md:order-2">
                <h2 className="text-[45px] font-semibold">Get outside.</h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      As an avid outdoorsman, surfer, and snowboarder, Michael promotes nature-based activities to his
                      clients. As part of a comprehensive mind-body-emotion practice, connecting with nature is a core
                      aspect of reality alignment coaching.
                    </p>
                  </div>
                  <TrackedCtaLink
                    href="https://calendly.com/michaelzick/45min"
                    className="btn mt-6 text-xl"
                    location="about"
                  >
                    Book a Free Session
                  </TrackedCtaLink>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-1">
                <Image
                  src="/img/pitted.webp"
                  alt="Michael surfing a wave"
                  width={2000}
                  height={1334}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
            </FadeInSection>

            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 md:order-2">
                <Image
                  src="/img/grey_jacket.webp"
                  alt="Michael in suit"
                  width={2500}
                  height={1667}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2 space-y-6 md:order-1">
                <h2 className="text-[45px] font-semibold">Let’s talk.</h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      Michael has successfully coached celebrities, entrepreneurs, Nice Guys, and high-functioning adults
                      to create better goals, careers, and relationships.
                    </p>
                    <p className="text-[23px]">Is it time to get in touch with reality?</p>
                  </div>
                  <TrackedCtaLink
                    href="https://calendly.com/michaelzick/45min"
                    className="btn mt-6 text-xl"
                    location="about"
                  >
                    Book a Free Session
                  </TrackedCtaLink>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}

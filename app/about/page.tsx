import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeInSection } from '../../components/FadeInSection';
import TrackedCtaLink from '../../components/TrackedCtaLink';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Michael Zick | About',
  description:
    'Learn about Michael Zick, a Nice Guy Recovery Coach helping high-functioning men break free from approval addiction, toxic shame, and enmeshment to reclaim internal authority.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Michael Zick | Nice Guy Recovery Coach',
    description:
      'I didn\'t just study the Nice Guy trap. I lived it. Learn about my journey through enmeshment, approval addiction, and the ongoing path of recovery.',
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
    title: 'Michael Zick | Nice Guy Recovery Coach',
    description:
      'Learn about Michael Zick, a Nice Guy Recovery Coach helping high-functioning men break free from approval addiction.',
    images: ['/img/ocean_2500.webp'],
  },
};

export default function About() {
  const credentials = [
    'Certified by Dr. Robert Glover, author of "No More Mr. Nice Guy" and renowned therapist.',
    'Certified as a Life & Relationship Coach by Life Purpose Institute.',
    'Established in the Los Angeles mental health and 12-Step recovery community since 2015.',
  ];

  return (
    <div className="flex flex-col">
      <section className="px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <FadeInSection className="mb-10 text-center md:text-left" immediate>
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
              About Michael
            </h1>
          </FadeInSection>
          <div className="space-y-24 md:space-y-32">
            {/* The Descent */}
            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 space-y-6 order-2 md:order-1">
                <h2 className="text-[45px] font-semibold leading-[1.1] tracking-tight">
                  I didn&apos;t just study the Nice Guy trap. I lived it.
                </h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      From the age of seven, following my parents&apos; separation, I became my mother&apos;s surrogate spouse. Not physically, but emotionally. I became the &quot;man of the house&quot; and the sponge for her pain and unmet needs.
                    </p>
                    <p className="text-[23px]">
                      In that environment, acting like a kid wasn&apos;t allowed. Mistakes weren&apos;t tolerated. I learned early that &quot;adult-level performance&quot; was the only safe way to exist. I became an expert at managing other people&apos;s emotions while entirely abandoning my own.
                    </p>
                    <p className="text-[23px]">
                      This enmeshment built my blueprint for adulthood: love equated to intensity, performance, and doing whatever it took to keep things stable. I grew up believing that my worth was dictated entirely by how deeply I was approved of by women.
                    </p>
                  </div>
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

            {/* Credentials */}
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

            {/* The Awakening */}
            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 space-y-6 order-2 md:order-2">
                <h2 className="text-[45px] font-semibold leading-[1.1] tracking-tight">
                  Anxiety was my drug. Approval was my currency.
                </h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      As a man, that enmeshment translated into fierce approval addiction and toxic shame. I jumped from career to career and relationship to relationship, sabotaging success because the anxiety and intensity felt &quot;real,&quot; while stability felt like boredom.
                    </p>
                    <p className="text-[23px]">
                      I was a consummate Nice Guy. I was conflict-avoidant, relied on covert contracts, and treated my interactions like a PR campaign to ensure I was never rejected.
                    </p>
                    <p className="text-[23px]">
                      The turning point came in 2015 when I fully committed to 12-Step recovery, inner child work, and somatic regulation. I had to face the terror of getting in touch with my pain, dropping the mask, and learning to tolerate uncertainty and other people&apos;s displeasure without trying to &quot;fix&quot; it.
                    </p>
                  </div>
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

            {/* The Mission */}
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
                <h2 className="text-[45px] font-semibold leading-[1.1] tracking-tight">
                  Reclaiming Internal Authority.
                </h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      Today, my mission is helping high-functioning men who look successful on the outside but are secretly exhausted from auditioning for approval on the inside.
                    </p>
                    <p className="text-[23px]">
                      I work with men to break their approval addiction, end the cycle of enmeshment, and date, mate, and live with unshakeable internal authority. You don&apos;t have to keep performing.
                    </p>
                    <p className="text-[23px]">
                      It&apos;s time to become the chooser again.
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
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}

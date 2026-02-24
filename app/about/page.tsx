import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeInSection } from '../../components/FadeInSection';
import TrackedCtaLink from '../../components/TrackedCtaLink';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Michael Zick | About',
  description: siteConfig.description,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Michael Zick | Nice Guy Recovery Coach',
    description: siteConfig.description,
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
    description: siteConfig.description,
    images: ['/img/ocean_2500.webp'],
  },
};

export default function About() {
  const credentials = [
    'Certified by Dr. Robert Glover, author of "No More Mr. Nice Guy"',
    'Certified as a Life & Relationship Coach by Life Purpose Institute',
    'Established in the Los Angeles mental health community since 2015',
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
              <div className="md:w-[62.5%] space-y-6 order-2 md:order-1">
                <h2 className="text-[45px] font-semibold leading-[1.1] tracking-tight">
                  I didn&apos;t just study Nice Guy Syndrome.
                </h2>
                <h2 className="text-[45px] font-semibold leading-[1.1] tracking-tight">
                  I lived it.
                </h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      Following my parents&apos; separation when I was seven, I became my mother&apos;s emotional surrogate. In that environment, acting like a kid wasn&apos;t allowed. I learned early that adult-level performance was my only path to safety, becoming an expert at managing others&apos; emotions while entirely abandoning my own.
                    </p>
                    <p className="text-[23px]">
                      This enmeshment built a toxic blueprint for adulthood: love equated to intensity, performance, and keeping things stable. I grew up completely convinced that my worth as a man was dictated entirely by how deeply I was approved of by women.
                    </p>
                  </div>
                  <TrackedCtaLink
                    href="https://calendly.com/michaelzick/45min"
                    className="btn mt-6 text-xl"
                    location="about-top"
                  >
                    Book a Free Session
                  </TrackedCtaLink>
                </div>
              </div>
              <div className="md:w-[37.5%] order-1 md:order-2">
                <Image
                  src="/img/gray-suit-headshot.webp"
                  alt="Michael in a grey suit"
                  width={2500}
                  height={3124}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
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
                      That enmeshment translated into fierce approval addiction and toxic shame. I was a consummate Nice Guy—conflict-avoidant, relying on covert contracts, and treating every interaction like a PR campaign to ensure I was never rejected.
                    </p>
                    <p className="text-[23px]">
                      My turning point came in 2015 when I fully committed to recovery, mindfulness meditation, Internal Family Systems (IFS), and somatic regulation. I finally faced the terror of dropping the mask, getting in touch with my pain, and learning to tolerate other people&apos;s displeasure without trying to fix it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-1">
                <Image
                  src="/img/grey_jacket.webp"
                  alt="Michael in suit"
                  width={2500}
                  height={1667}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
            </FadeInSection>

            {/* The Mission */}
            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 md:order-2">
                <Image
                  src="/img/gray-suit-dark-laughing.webp"
                  alt="Michael in grey suit"
                  width={2000}
                  height={1334}
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
                      Today, my mission is helping high-functioning men who look successful on the outside but are secretly exhausted from auditioning for approval on the inside. I work with men to break their approval addiction, end the cycle of enmeshment, and lead with unshakeable internal authority.
                    </p>
                    <p className="text-[23px]">
                      You don&apos;t have to spend the rest of your life performing for validation. It&apos;s time to take control of your ship.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* Credentials & CTA */}
            <FadeInSection className="space-y-12">
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
              <div className="flex justify-start">
                <TrackedCtaLink
                  href="https://calendly.com/michaelzick/45min"
                  className="btn text-xl"
                  location="about-bottom"
                >
                  Book a Free Session
                </TrackedCtaLink>
              </div>
            </FadeInSection>
          </div>
        </div >
      </section >
    </div >
  );
}

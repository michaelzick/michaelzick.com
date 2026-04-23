import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeInSection } from '../../components/FadeInSection';
import BookingCta from '../../components/BookingCta';
import QuestionnaireCta from '../../components/QuestionnaireCta';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'About Michael Zick | Nice Guy Recovery Coach',
  description: 'Michael Zick is an LA-based Nice Guy Recovery Coach helping high-functioning men break approval addiction, covert contracts, enmeshment, and self-abandonment.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Michael Zick | Nice Guy Recovery Coach',
    description: 'Learn how Michael Zick lived Nice Guy patterns, recovered from approval addiction, and now coaches men back to internal authority.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/img/gray-suit-headshot.webp',
        alt: 'Michael Zick in a grey suit',
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Michael Zick | Nice Guy Recovery Coach',
    description: 'Learn how Michael Zick lived Nice Guy patterns, recovered from approval addiction, and now coaches men back to internal authority.',
    images: ['/img/gray-suit-headshot.webp'],
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
      <section className="px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40 bg-light-grey text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <FadeInSection className="mb-10 text-center md:text-left" immediate>
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
              I Know This Pattern From the Inside
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
                      Growing up, acting like a kid wasn&apos;t allowed. I learned early that adult-level performance was my path to safety. I became skilled at reading the room, managing other people&apos;s emotions, and abandoning my own truth before anyone could reject it.
                    </p>
                    <p className="text-[23px]">
                      After my parents separated when I was seven, I became my mother&apos;s emotional surrogate. That environment built a blueprint I carried into adulthood: love meant intensity, performance, and keeping things stable. I learned to confuse approval with safety and a woman&apos;s mood with my worth as a man.
                    </p>
                    <p className="text-[23px]">
                      If you look successful on the outside but feel hijacked by approval on the inside, this is the work I know best.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col items-start gap-4">
                    <BookingCta location="about-top" />
                    <QuestionnaireCta location="about-top" className="btn-secondary cta-unified btn-secondary-dark" />
                  </div>
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
                  Approval was my drug. Anxiety was the side effect.
                </h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      That enmeshment turned into approval addiction and SHAME: Should Have Already Mastered Everything. I became the classic Nice Guy: conflict-avoidant, dependent on covert contracts, and treating every interaction like a PR campaign designed to keep me from being rejected.
                    </p>
                    <p className="text-[23px]">
                      My turning point came in 2015 when I fully committed to recovery, mindfulness meditation, Internal Family Systems (IFS), and somatic regulation. I had to face the terror of dropping the mask, telling the truth, and tolerating other people&apos;s displeasure without trying to fix it.
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
                  Now I Help Men Stop Abandoning Themselves.
                </h2>
                <div>
                  <div className="space-y-4">
                    <p className="text-[23px]">
                      Today, I coach high-functioning men who are tired of auditioning for approval in dating, partnership, family, and work. We name the approval loop, expose the covert contracts, build real boundaries, and practice leading from internal authority instead of emotional outsourcing.
                    </p>
                    <p className="text-[23px]">
                      You do not have to spend the rest of your life being easy to love at the cost of being hard to know. It is time to become honest, grounded, and self-led.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col items-start gap-4">
                    <BookingCta location="about-mission" />
                    <QuestionnaireCta location="about-mission" className="btn-secondary cta-unified btn-secondary-dark" />
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
              <div className="flex flex-col items-start gap-4">
                <BookingCta location="about-bottom" />
                <QuestionnaireCta location="about-bottom" className="btn-secondary cta-unified btn-secondary-dark" />
              </div>
            </FadeInSection>
          </div>
        </div >
      </section >
    </div >
  );
}

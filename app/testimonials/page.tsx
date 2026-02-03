import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeInSection } from '../../components/FadeInSection';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Michael Zick | Testimonials',
  description:
    "Read testimonials from clients of Michael Zick's reality alignment coaching program.",
  alternates: {
    canonical: '/testimonials',
  },
  openGraph: {
    title: 'Michael Zick | Testimonials',
    description:
      "Read testimonials from clients of Michael Zick's reality alignment coaching program.",
    url: `${siteConfig.url}/testimonials`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/img/mountains_2500.webp',
        alt: 'Mountain range at sunrise',
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Testimonials',
    description:
      "Read testimonials from clients of Michael Zick's reality alignment coaching program.",
    images: ['/img/mountains_2500.webp'],
  },
};

export default function Testimonials() {
  return (
    <div className="flex flex-col">
      <section className="bg-dark-blue text-white px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40">
        <div className="max-w-[1400px] mx-auto">
          <FadeInSection className="mb-10 text-center md:text-left" immediate>
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl text-white">
              Testimonials
            </h1>
          </FadeInSection>
          <div className="space-y-24">
            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2 order-2 md:order-1 space-y-6">
                <h3 className="text-[35px] font-medium">Elizabeth D.</h3>
                <p className="text-[23px]">
                  “I think following that tiny voice in your head is what leads you to the most
                  amazing surprises! I was online one day looking at dating blogs, dating apps, and
                  dating groups when I stumbled onto a group of people at a free zoom meeting that
                  Michael was offering about dating. I liked what we all talked about, how Michael
                  responded to everybody, and that I was offered a free 45 minute coaching session
                  with him. I was really surprised with how in-tuned he was and how much he was able
                  to help me in that one session. He was able to really hear in between things I was
                  saying and know what was important to bring up!
                </p>
                <p className="text-[23px]">
                  I went ahead and agreed to some more coaching with him. He really has a gift and
                  he doesn’t feel like someone that was just in it for the money. I’m super grateful I
                  stumbled onto Michael Zick! I’ve seen some amazing changes in my world already,
                  not just in the dating realm, but all kinds of amazing revelations and changes are
                  happening in other areas of my life, too.”
                </p>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <Image
                  src="/img/eg.webp"
                  alt="Elizabeth D."
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
            </FadeInSection>

            <FadeInSection className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2">
                <Image
                  src="/img/ryan.webp"
                  alt="Ryan I."
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2 space-y-6">
                <h3 className="text-[35px] font-medium">Ryan I.</h3>
                <p className="text-[23px]">
                  “I completed a one-on-one coaching series with Michael Zick and it was an
                  overwhelmingly positive experience. He provided me with a unique service I
                  haven’t experienced in any therapist or doctors office - NO cookie cutter
                  solutions.
                </p>
                <p className="text-[23px]">
                  Instead, he helped me uncover my challenges, hiding under the surface, and we
                  worked at them together. Michael Zick has a deep well of empathy, knowledge and
                  tools to help virtually anyone. He’s done the hard personal work himself.
                </p>
                <p className="text-[23px]">
                  Michael helped and pushed me to discover what it is that I was needing, then gave
                  me perspective, feedback, and tools to move through to a place of better clarity
                  and self knowledge.”
                </p>
              </div>
            </FadeInSection>

            <FadeInSection className="mt-16 flex flex-col items-center justify-center gap-6 md:flex-row">
              <a
                href="https://calendly.com/michaelzick/45min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn text-xl"
              >
                Book a Free Session
              </a>
              <a
                href="/questionnaire"
                className="rainbow-glass-btn cta-unified"
              >
                Take the Questionnaire
              </a>
            </FadeInSection>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-12 pb-24 md:pt-16 md:pb-32 bg-[rgb(var(--light-grey))] text-default-grey">
        <div className="max-w-[1400px] mx-auto space-y-12 text-[23px]">
          <FadeInSection className="max-w-4xl mx-auto md:mx-0">
            <h2 className="font-headline text-[45px] font-semibold leading-tight text-center md:text-left">More Testimonials</h2>
          </FadeInSection>

          <FadeInSection className="space-y-4">
            <p>
              “This program is exceptional. If you want something different from your life and are
              committed to seeing change, this program will change your life! Every area of my
              life has improved.”
            </p>
            <p className="font-semibold">— Doug S.</p>
          </FadeInSection>

          <FadeInSection className="space-y-4">
            <p>
              “When I think about what makes a great coach in any discipline, I think about
              someone that is not only encouraging and knowledgeable in a particular area, but
              someone who helps you to see your own seeds of greatness. The best coaches are
              experts at finding those seeds in you. They water and nurture them until they take
              root. As you cultivate your skills and tools, they help you identify and remove the
              weeds that would inevitably subvert your growth. They are the shepherds of your
              vision and the guide to uncovering your potential.
            </p>
            <p>
              As a life coach and mentor, Michael Zick has been a true shepherd and guide. His
              ability to help me cut through the noise and realize I already have the answers and
              direction I need is a true gift. I have been truly blessed to have him as a coach, a
              friend, and that kick in the pants when I needed it. I highly recommend Michael to
              help those wanting to uncover their own greatness.”
            </p>
            <p className="font-semibold">— Greg C.</p>
          </FadeInSection>

          <FadeInSection className="space-y-4">
            <p>
              “When I came to Michael for coaching, I was brand new to the process. I thought it
              would be more advice driven but it wasn’t. I want to say thank you, Michael! You
              have made a substantial impact on my life, not by telling me what I need to do, but
              by guiding me to find the answers myself.
            </p>
            <p>
              You consistently asked probing questions to get me to seek answers from within, and
              then continued to drill down to get to the specifics of each issue. This has had a
              powerful and empowering effect that has given me motivation and excitement to pursue
              my dreams.
            </p>
            <p>
              Couldn’t be happier! I highly recommend you and the service you provide.”
            </p>
            <p className="font-semibold">— Earl M.</p>
          </FadeInSection>

          <FadeInSection className="space-y-4">
            <p>
              “For me, working with a life coach is rooted in their ability to recognize blindspots
              and obstacles that may be limiting my growth. Michael has that unique ability to help
              me see the unseen. He brings his complete and total presence to the work and a
              mindset that encourages looking inward as well as outward to define your growing edge
              and push beyond it. There are no shortcuts or quick-fixes in his approach.
            </p>
            <p>
              Through Michael’s guidance, I established a clear vision for my professional and
              personal goals, created a tangible plan to work through my challenges, and identified
              tools to manage the accountability process. That clarity of purpose and direction were
              exactly what I was seeking.”
            </p>
            <p className="font-semibold">— Howard B.</p>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

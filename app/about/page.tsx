import type { Metadata } from 'next';
import { FadeInSection } from '../../components/FadeInSection';

export const metadata: Metadata = {
  title: 'Michael Zick | About',
  description:
    'Helping high-functioning adults separate fear and anxiety from reality.',
  openGraph: {
    title: 'Michael Zick | About',
    description:
      'Helping high-functioning adults separate fear and anxiety from reality.',
    url: 'https://www.michaelzick.com/about',
    siteName: 'Michael Zick | Reality Alignment Coach',
    images: [
      {
        url: 'https://www.michaelzick.com/img/ocean_2500.webp',
        alt: 'Dark mountain landscape',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | About',
    description:
      'Helping high-functioning adults separate fear and anxiety from reality.',
    images: ['https://www.michaelzick.com/img/ocean_2500.webp'],
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
      <section
        className="relative h-screen flex items-end text-white"
        style={{ backgroundImage: "url('/img/ocean_2500.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
        <div className="relative w-full max-w-[1400px] mx-auto p-8">
          <h2 className="text-4xl md:text-6xl text-right">About</h2>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-24 md:pt-32 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto space-y-24 md:space-y-32">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <FadeInSection className="md:w-1/2 space-y-6 order-2 md:order-1">
              <h2 className="text-[45px] font-semibold">Michael is all about action.</h2>
              <p className="text-[23px]">
                He stands by the phrase, &quot;We don&apos;t think our way into right action; we act our
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
            </FadeInSection>
            <FadeInSection className="md:w-1/2 order-1 md:order-2">
              <img
                src="/img/blue_jacket.webp"
                alt="Michael wearing a jacket"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </FadeInSection>
          </div>
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
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <FadeInSection className="md:w-1/2 space-y-6 order-2 md:order-2">
              <h2 className="text-[45px] font-semibold">Get outside.</h2>
              <p className="text-[23px]">
                As an avid outdoorsman, surfer, and snowboarder, Michael promotes nature-based activities to his
                clients. As part of a comprehensive mind-body-emotion practice, connecting with nature is a core
                aspect of reality alignment coaching.
              </p>
            </FadeInSection>
            <FadeInSection className="md:w-1/2 order-1 md:order-1">
              <img
                src="/img/mt-hood-selfie-darkened.webp"
                alt="Michael outdoors in the mountains"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </FadeInSection>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <FadeInSection className="md:w-1/2 md:order-2">
              <img
                src="/img/grey_jacket.webp"
                alt="Michael in suit"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </FadeInSection>
            <FadeInSection className="md:w-1/2 space-y-6 md:order-1">
              <p className="text-[23px]">
                Michael has successfully coached celebrities, entrepreneurs, Nice Guys, and high-functioning adults
                to create better goals, careers, and relationships.
              </p>
              <p className="text-[23px]">Is it time to get in touch with reality?</p>
              <h2 className="text-[45px] font-semibold">Let’s talk.</h2>
              <a
                href="https://calendly.com/michaelzick/45min"
                target="_blank"
                className="btn inline-block text-xl"
              >
                Book a Free Session
              </a>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next'
import { FadeInSection } from '../../components/FadeInSection'

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
}

export default function About() {
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
        <div className="max-w-[1400px] mx-auto">
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
            <div className="md:w-1/2 order-1 md:order-2">
              <img
                src="/img/blue_jacket.webp"
                alt="Michael wearing a jacket"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-1/2">
              <img
                src="/img/grey_jacket.webp"
                alt="Michael in suit"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <FadeInSection className="md:w-1/2 space-y-6">
              <p className="text-[23px]">
                Michael has successfully coached celebrities, entrepreneurs, Nice Guys, and men
                and women through various transitions. Is it time for your life to change for the
                better?
              </p>
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

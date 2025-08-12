import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Michael Zick | About',
  description:
    'Learn more about Michael Zick, a Los Angeles-based peak performance coach dedicated to helping clients take action and build powerful relationships.',
  openGraph: {
    title: 'Michael Zick | About',
    description:
      'Learn more about Michael Zick, a Los Angeles-based peak performance coach dedicated to helping clients take action and build powerful relationships.',
    url: 'https://www.michaelzick.com/about',
    siteName: 'Michael Zick',
    images: [
      {
        url: 'https://www.michaelzick.com/img/dark_mountains_2500.webp',
        alt: 'Dark mountain landscape',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | About',
    description:
      'Learn more about Michael Zick, a Los Angeles-based peak performance coach dedicated to helping clients take action and build powerful relationships.',
    images: ['https://www.michaelzick.com/img/dark_mountains_2500.webp'],
  },
}

export default function About() {
  return (
    <div className="flex flex-col">
      <section
        className="relative text-white px-6 md:px-8 pt-40 md:pt-56 pb-24 md:pb-32 bg-center bg-cover md:min-h-[578px]"
        style={{
          backgroundImage:
            "url('/img/dark_mountains_2500.webp')"
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[64px] font-semibold mb-6">About</h1>
          <h3 className="text-[35px] font-light max-w-[900px]">
            “Mental health is a commitment to reality at all costs.”
            <br />
            — M. Scott Peck
          </h3>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-24 md:pt-32 bg-[rgb(var(--dark-blue))]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-1/2 space-y-6 order-2 md:order-1">
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
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img
                src="/img/blue_jacket.webp"
                alt="Michael wearing a jacket"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-1/2">
              <img
                src="/img/grey_jacket.webp"
                alt="Michael in suit"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <p className="text-[23px]">
                Michael has successfully coached celebrities, entrepreneurs, Nice Guys, and men
                and women through various transitions. Is it time for your life to change for the
                better?
              </p>
              <h2 className="text-[45px] font-semibold">Let’s talk.</h2>
              <a
                href="https://link.michaelzick.com/45min"
                target="_blank"
                className="btn inline-block text-lg"
              >
                Book a Free 45-Minute Strategy Session
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32 bg-[rgb(var(--light-grey))] text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-md text-[30px] font-medium">
                Certified as a Life &amp; Relationship Coach by Life Purpose Institute.
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md text-[30px] font-medium">
                Certified by Dr. Robert Glover, author of “No More Mr. Nice Guy” and renowned therapist.
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md text-[30px] font-medium">
                Established in the Los Angeles mental health and recovery community since 2015.
              </div>
              <a
                href="https://link.michaelzick.com/45min"
                target="_blank"
                className="btn inline-block mt-6 text-lg"
              >
                Book a Free 45-Minute Strategy Session
              </a>
            </div>
            <div className="space-y-6">
              <h2 className="text-[55px] font-semibold">Specialties:</h2>
              <ul className="list-disc pl-6 space-y-4 text-[30px]">
                <li>Nice Guy Syndrome</li>
                <li>Relationships &amp; dating</li>
                <li>Finding your purpose</li>
                <li>Codependency</li>
                <li>Belief reprogramming</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


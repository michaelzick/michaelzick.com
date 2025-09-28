import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Michael Zick | Peak Performance Coach',
  description:
    'Los Angeles-based peak performance coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
  openGraph: {
    title: 'Michael Zick | Peak Performance Coach',
    description:
      'Los Angeles-based peak performance coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
    url: 'https://www.michaelzick.com',
    siteName: 'Michael Zick',
    images: [
      {
        url: '/img/homepage_mountains.webp',
        alt: 'Mountain landscape at sunset',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Peak Performance Coach',
    description:
      'Los Angeles-based peak performance coach helping individuals take action, overcome limiting beliefs, and build powerful relationships.',
    images: [
      '/img/homepage_mountains.webp',
    ],
  },
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-end text-white" style={{backgroundImage: "url('/img/homepage_mountains.webp')", backgroundSize:'cover', backgroundPosition:'center'}}>
        <div className="w-full max-w-[1400px] mx-auto p-8">
          <h2 className="text-4xl md:text-6xl text-right">Peak Performance Coach</h2>
        </div>
      </section>

      {/* Where Do You Go From Here */}
      <section
        className="relative py-56 overflow-hidden"
        style={{
          backgroundImage:
            "url('/img/lake_reflection_2500.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative w-full mx-auto p-8 mt-[-88px] md:mt-[-112px]">
          <h2 className="text-5xl md:text-8xl text-white text-center font-bold">
            Where Do You Go From Here?
          </h2>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-[160px]"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C480,160 960,160 1440,0 L1440,160 L0,160 Z"
            fill="rgb(var(--light-grey))"
          />
        </svg>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-light-grey text-default-grey text-4xl">
        <div className="max-w-5xl mx-auto text-center space-y-8 px-2.5 md:px-0">
          <h2>You’ve tried things – many things probably, but you’re still in the same place. You know you can achieve more but something is holding you back.</h2>
          <h2>Perhaps what you need is someone who’s been through the same things as you but has found the knowledge, practices, and resources to change.</h2>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-center text-5xl mb-12">How My Process is Different</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <img src="/img/mountains_2500.webp" alt="Mountains" />
              <h3 className="px-2.5 md:px-0 text-4xl font-semibold">Identifying Meanings and Beliefs</h3>
              <p className="px-2.5 md:px-0 text-lg">Meanings and beliefs are like the programming language of our life. They provide a filter through which external information and experiences pass.</p>
            </div>
            <div className="space-y-4 text-center">
              <img src="/img/ocean_2500.webp" alt="Feelings" className="w-full h-100 object-cover" />
              <h3 className="px-2.5 md:px-0 text-4xl font-semibold">Working Through Feelings, Experientially</h3>
              <p className="px-2.5 md:px-0 text-lg">While analyzing the “why” and the “what” around our thoughts and behaviors is useful, behaviors rarely change without working through the feelings.</p>
            </div>
            <div className="space-y-4 text-center">
              <img src="/img/dark_mountains_2500.webp" alt="Action" className="w-full h-100 object-cover" />
              <h3 className="px-2.5 md:px-0 text-4xl font-semibold">Taking Consistent, Conscious Action</h3>
              <p className="px-2.5 md:px-0 text-lg">Through identifying beliefs and processing feelings you can enter a new state of consciousness and awareness. This is where true behavioral change happens.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-24 md:pt-32 pb-12 md:pb-16 bg-[rgb(var(--light-grey))] text-default-grey">
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

      <section className="px-6 md:px-8 pt-12 md:pt-16 pb-24 md:pb-32 bg-[rgb(var(--light-grey))] text-default-grey">
        <div className="max-w-[1400px] mx-auto md:flex md:items-start md:gap-12">
          <div className="space-y-6 md:w-1/2">
            <h2 className="text-[45px] font-semibold">Individual Coaching Program</h2>
            <h3 className="text-[35px] font-medium">The details:</h3>
            <ul className="list-disc pl-6 space-y-2 text-[23px]">
              <li>
                Work with a certified coach to <strong>significantly improve</strong> your life and relationships
              </li>
              <li>
                <strong>Powerful</strong> homework assignments that dive deep; we’ll leave no stone unturned
              </li>
              <li>
                <strong>Unlimited emails</strong> between sessions (subject to availability)
              </li>
              <li>6-month program to start; variable after that</li>
              <li>Free Belief Reprogramming Workbook</li>
            </ul>
            <a
              href="https://calendly.com/michaelzick/45min"
              target="_blank"
              className="btn mt-6 inline-block text-lg"
            >
              Book a Free 45-Minute Strategy Session
            </a>
          </div>
          <div className="mt-10 md:mt-0 md:w-1/2 flex md:justify-end">
            <img
              src="/img/waterfall_2500.webp"
              alt="Waterfall cascading over rocks"
              className="w-full max-h-[480px] object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-24 bg-gray-800 text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-5xl">Subscribe to My Newsletter</h2>
          <h3 className="text-3xl">You’ll receive a FREE Belief Reprogramming Workbook (a $97 value) and early access to free courses. No spam; unsubscribe at any time.</h3>
          <a href="https://link.michaelzick.com/sign-up" target="_blank" className="btn">Subscribe</a>
        </div>
      </section> */}
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Michael Zick | Work With Me',
  description:
    'Explore coaching programs with Michael Zick to achieve peak performance and lasting change.',
  openGraph: {
    title: 'Michael Zick | Work With Me',
    description:
      'Explore coaching programs with Michael Zick to achieve peak performance and lasting change.',
    url: 'https://www.michaelzick.com/work-with-me',
    siteName: 'Michael Zick',
    images: [
      {
        url: 'https://www.michaelzick.com/img/ocean_2500.webp',
        alt: 'Closeup of the ocean',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Zick | Work With Me',
    description:
      'Explore coaching programs with Michael Zick to achieve peak performance and lasting change.',
    images: ['https://www.michaelzick.com/img/ocean_2500.webp'],
  },
}

export default function WorkWithMe() {
  return (
    <div className="flex flex-col">
      <section
        className="relative text-white px-6 md:px-8 pt-40 md:pt-56 pb-24 md:pb-32 bg-center bg-cover md:min-h-[578px]"
        style={{
          backgroundImage:
            "url('/img/ocean_2500.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-[1400px] mx-auto">
          <h1 className="text-[64px] font-semibold mb-6">Work With Me</h1>
          <h3 className="text-[35px] font-light max-w-[900px]">
            “You can&apos;t go back and change the beginning, but you can start where you are and change the ending.”
            <br />
            — C.S. Lewis
          </h3>
        </div>
      </section>
      <section className="px-6 md:px-8 py-24 md:py-32 bg-[rgb(var(--light-grey))] text-default-grey">
        <div className="max-w-[1400px] mx-auto space-y-6">
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
          <div>
            <a
              href="https://link.michaelzick.com/45min"
              target="_blank"
              className="btn mt-6 inline-block text-lg"
            >
              Book a Free 45-Minute Strategy Session
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}


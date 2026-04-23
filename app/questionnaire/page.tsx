import type { Metadata } from 'next';
import Questionnaire from '../../components/Questionnaire';
import { siteConfig } from '../../lib/site';
import { FadeInSection } from '../../components/FadeInSection';

export const metadata: Metadata = {
  title: 'Approval Pattern Audit | Michael Zick',
  description:
    'Take the Approval Pattern Audit to identify people-pleasing, covert contracts, and approval addiction patterns that keep you stuck.',
  alternates: {
    canonical: '/questionnaire',
  },
  openGraph: {
    title: 'Approval Pattern Audit | Michael Zick',
    description:
      'Find where you are over-giving, avoiding conflict, and giving your power away in relationships.',
    url: `${siteConfig.url}/questionnaire`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.defaultImage,
        alt: 'Mountain landscape at sunset',
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Approval Pattern Audit | Michael Zick',
    description:
      'Find where you are over-giving, avoiding conflict, and giving your power away in relationships.',
    images: [siteConfig.defaultImage],
  },
};

export default function QuestionnairePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-dark-blue text-white px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <FadeInSection className="mb-12 text-center md:text-left" immediate>
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl text-white">
              The Approval Pattern Audit
            </h1>
            <p className="mt-8 text-xl text-white/80 md:max-w-none mx-auto md:mx-0">
              Find the places where being the &quot;good guy&quot; is costing you honesty, desire, and self-respect.
              <br />
              <strong className="block mt-2 text-white">Get a personalized read on the approval loop you are ready to break.</strong>
            </p>
          </FadeInSection>
          <FadeInSection>
            <Questionnaire />
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

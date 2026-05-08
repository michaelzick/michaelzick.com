import type { Metadata } from 'next';
import Questionnaire from '../../components/Questionnaire';
import { siteConfig } from '../../lib/site';
import { FadeInSection } from '../../components/FadeInSection';

export const metadata: Metadata = {
  title: 'Nice Guy Recovery Questionnaire | Michael Zick',
  description:
    'Take the Approval Addiction Questionnaire to identify people-pleasing patterns and discover your path to Nice Guy recovery.',
  alternates: {
    canonical: '/questionnaire',
  },
  openGraph: {
    title: 'Nice Guy Recovery Questionnaire | Michael Zick',
    description:
      'Discover where you\'re giving your power away, and how to take it back. Take the Approval Addiction Questionnaire.',
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
    title: 'Nice Guy Recovery Questionnaire | Michael Zick',
    description:
      'Discover where you\'re giving your power away, and how to take it back. Take the Approval Addiction Questionnaire.',
    images: [siteConfig.defaultImage],
  },
};

export default function QuestionnairePage() {
  return (
    <div className="flex flex-col">
      <section className="page-top-offset overflow-x-clip bg-dark-blue text-white px-6 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <FadeInSection className="mb-12 text-center md:text-left" immediate>
            <h1 className="font-headline text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              The Approval Addiction Questionnaire
            </h1>
            <p className="mt-8 text-xl text-white/80 md:max-w-none mx-auto md:mx-0">
              Discover where you&apos;re giving your power away, and how to take it back.
              <br />
              <strong className="block mt-2 text-white">Find your path to internal authority.</strong>
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

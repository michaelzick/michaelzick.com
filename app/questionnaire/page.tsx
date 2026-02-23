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
};

export default function QuestionnairePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gray-100 text-default-grey px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <FadeInSection className="mb-12 text-center md:text-left" immediate>
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl text-dark-blue">
              The Approval Addiction Questionnaire
            </h1>
            <p className="mt-8 text-xl text-default-grey/80 md:max-w-none mx-auto md:mx-0">
              Discover where you&apos;re giving your power away, and how to take it back.
              <br />
              <strong className="block mt-2">Find your path to internal authority.</strong>
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

import type { Metadata } from 'next';
import Questionnaire from '../../components/Questionnaire';
import { siteConfig } from '../../lib/site';
import { FadeInSection } from '../../components/FadeInSection';

export const metadata: Metadata = {
  title: 'Reality Alignment Questionnaire | Michael Zick',
  description: 'Take the Reality Alignment Questionnaire to discover where you are misaligned and how action-oriented coaching can help you.',
  alternates: {
    canonical: '/questionnaire',
  },
};

export default function QuestionnairePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-[rgb(var(--light-grey))] text-default-grey px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 lg:pt-36 xl:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <FadeInSection className="mb-12 text-center md:text-left">
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl text-dark-blue">
              Reality Alignment Questionnaire
            </h1>
            <p className="mt-8 text-xl text-default-grey/80 md:max-w-none mx-auto md:mx-0">
              &quot;We don&apos;t think our way into right action; we act our way into right thinking.&quot;
              <br />
              <strong className="block mt-2">Discover your path to alignment.</strong>
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

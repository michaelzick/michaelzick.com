import type { Metadata } from 'next';
import Questionnaire from '../../components/Questionnaire';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Reality Alignment Questionnaire | Michael Zick',
  description: 'Take the Reality Alignment Questionnaire to discover where you are misaligned and how action-oriented coaching can help you.',
  alternates: {
    canonical: '/questionnaire',
  },
};

export default function QuestionnairePage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--light-grey))] pt-32 pb-16 md:pb-20 px-6 text-default-grey">
      <div className="max-w-[1400px] mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-dark-blue mb-4">
          Reality Alignment Questionnaire
        </h1>
        <p className="text-xl text-default-grey/80 max-w-xl mx-auto">
          "We don't think our way into right action; we act our way into right thinking."
          <br />
          <strong className="block mt-2">Discover your path to alignment.</strong>
        </p>
      </div>
      <Questionnaire />
    </div>
  );
}

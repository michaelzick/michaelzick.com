'use client';

import Link from 'next/link';

interface QuestionnaireAnalysisProps {
  analysis: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function QuestionnaireAnalysis({ analysis, cardRef }: QuestionnaireAnalysisProps) {
  return (
    <div
      ref={cardRef}
      className="max-w-3xl mx-auto p-8 bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 mt-12 animate-fade-in"
    >
      <h2 className="text-3xl font-bold mb-6 border-b pb-4">Your Recovery Assessment</h2>
      <div className="prose prose-lg max-w-none prose-slate">
        {analysis.split('\n').map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>
      <div className="mt-12 p-6 bg-dark-blue/5 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <a
            href="https://calendly.com/michaelzick/45min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-xl whitespace-nowrap"
          >
            Book a Free Session
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border-2 border-primary-blue text-primary-blue transition-all duration-300 hover:bg-primary-blue/10 font-bold text-xl whitespace-nowrap px-[42px] py-[30px]"
          >
            Contact Michael
          </Link>
        </div>
      </div>
    </div>
  );
}

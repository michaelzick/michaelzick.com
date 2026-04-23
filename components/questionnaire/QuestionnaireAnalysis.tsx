'use client';

import Link from 'next/link';
import TrackedCtaLink from '../TrackedCtaLink';
import { trackLinkClick } from '../../lib/analytics';

interface QuestionnaireAnalysisProps {
  analysis: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function QuestionnaireAnalysis({ analysis, cardRef }: QuestionnaireAnalysisProps) {
  const handleAnalysisLinkClick = (label: string, href: string, section: string) => () => {
    trackLinkClick({
      location: 'questionnaire-analysis',
      label,
      href,
      section,
      pagePath: window.location.pathname,
    });
  };

  return (
    <div
      ref={cardRef}
      className="max-w-3xl mx-auto p-8 bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 mt-12 animate-fade-in"
    >
      <h2 className="text-3xl font-bold mb-6 border-b pb-4">Your Approval Pattern Audit</h2>
      <div className="prose prose-lg max-w-none prose-slate">
        {analysis.split('\n').map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>
      <div className="mt-12 p-6 bg-dark-blue/5 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <TrackedCtaLink
            href="https://calendly.com/michaelzick/45min"
            className="btn cta-unified whitespace-nowrap"
            location="questionnaire-analysis"
            label="Book Your Free 45-Min Session"
            eventName="book_free_session_click"
          >
            Book Your Free 45-Min Session
          </TrackedCtaLink>
          <Link
            href="/contact"
            className="btn-secondary cta-unified"
            onClick={handleAnalysisLinkClick('Contact Michael', '/contact', 'cta')}
          >
            Send a Direct Message
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '../lib/analytics';
import { Step, FormData } from '../lib/types';

const STEPS: Step[] = [
  {
    id: 'intake',
    title: 'Who are you?',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
    ],
  },
  {
    id: 'struggle',
    title: 'What is your biggest current struggle?',
    questions: [
      {
        id: 'mainStruggle',
        text: 'Briefly describe what is currently feeling "out of alignment" in your life (career, relationship, or personal growth).',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'action',
    title: 'Ownership vs. Victimhood',
    questions: [
      {
        id: 'ownership',
        text: 'On a scale of 1-10, how much ownership are you taking for this situation versus blaming external factors?',
        type: 'range',
        min: 1,
        max: 10,
      },
      {
        id: 'victimhood',
        text: 'Where do you feel like a "victim" in your life right now?',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'thinking',
    title: 'Thinking vs. Acting',
    questions: [
      {
        id: 'rumination',
        text: 'Are you trying to "think" your way out of this problem, or are you taking physical steps to change it?',
        type: 'textarea',
      },
    ],
  },
];

export default function Questionnaire() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    answers: {},
  });
  const [consented, setConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStep = STEPS[stepIndex];

  const isStepValid = () => {
    if (currentStep.id === 'intake') {
      return (
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.email.trim() !== '' &&
        consented
      );
    }

    // Check all questions in current step
    if (currentStep.questions) {
      return currentStep.questions.every((q: any) => {
        if (q.type === 'range') return true; // Range always has a value
        const answer = formData.answers[q.id];
        return answer && answer.trim() !== '';
      });
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (currentStep.id === 'intake') {
      setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev: FormData) => ({
        ...prev,
        answers: { ...prev.answers, [name]: value },
      }));
    }
  };

  const nextStep = () => {
    if (!isStepValid()) return;

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    trackEvent('questionnaire_submit', { email: formData.email });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (analysis) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 mt-12 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 border-b pb-4">Your Reality Alignment Analysis</h2>
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
              Schedule Your Free Session
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Disclaimer Section */}
      <div className="mb-6 p-4 bg-primary-blue/5 border border-primary-blue/10 rounded-lg text-sm text-default-grey/80">
        <p className="text-center font-bold mb-3 text-base">Notice</p>
        <div className="space-y-2 text-left">
          <p>
            This questionnaire uses AI (OpenAI) to analyze your responses and generate personalized coaching insights.
            Your responses and contact information will be securely emailed to Michael Zick for review. We value your privacy;
            your data is never shared with third parties and is kept strictly confidential.
          </p>
        </div>
      </div>

      <div className="bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-dark-blue/60">
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-blue transition-all duration-500"
                style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-dark-blue">{currentStep.title}</h2>
        </div>

        <div className="space-y-6">
          {currentStep.fields?.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-2 text-dark-blue/80">
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
                required
                aria-required="true"
              />
            </div>
          ))}

          {currentStep.id === 'intake' && (
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                />
                <span className="text-sm text-default-grey/80 leading-snug group-hover:text-default-grey transition-colors">
                  I consent to having my responses analyzed by AI and shared with Michael Zick.
                  I agree to be contacted by Michael regarding my results and coaching opportunities.
                </span>
              </label>
            </div>
          )}

          {currentStep.questions?.map((q) => (
            <div key={q.id}>
              <label htmlFor={q.id} className="block text-lg font-medium mb-3 text-dark-blue/90">
                {q.text}
              </label>
              {q.type === 'textarea' ? (
                <textarea
                  id={q.id}
                  name={q.id}
                  value={formData.answers[q.id] || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
                  required
                  aria-required="true"
                />
              ) : q.type === 'range' ? (
                <div className="space-y-4">
                  <input
                    id={q.id}
                    type="range"
                    name={q.id}
                    min={q.min}
                    max={q.max}
                    value={formData.answers[q.id] || q.min}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
                  />
                  <div className="flex justify-between text-sm font-bold text-dark-blue">
                    <span>{q.min} (Victimhood)</span>
                    <span className="bg-primary-blue text-white px-3 py-1 rounded-full">
                      Current: {formData.answers[q.id] || q.min}
                    </span>
                    <span>{q.max} (Ownership)</span>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={stepIndex === 0 || isSubmitting}
            className={`text-dark-blue font-semibold transition-opacity disabled:opacity-0 ${stepIndex === 0 ? 'invisible' : ''
              }`}
          >
            ← Back
          </button>
          <button
            onClick={nextStep}
            disabled={isSubmitting || !isStepValid()}
            className="btn !py-4 !px-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : stepIndex === STEPS.length - 1 ? (
              'Get My Analysis'
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

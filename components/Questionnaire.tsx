'use client';

import { useState } from 'react';
import { trackEvent } from '../lib/analytics';

const STEPS = [
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
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    answers: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStep = STEPS[stepIndex];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (currentStep.id === 'intake') {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        answers: { ...prev.answers, [name]: value },
      }));
    }
  };

  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      window.scrollTo(0, 0);
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
      <div className="max-w-3xl mx-auto p-8 bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 mt-12 mb-24 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 border-b pb-4">Your Reality Alignment Analysis</h2>
        <div className="prose prose-lg max-w-none prose-slate">
          {analysis.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-6 p-6 bg-dark-blue/5 rounded-lg">
          <p className="text-xl font-medium text-center italic">
            "We don't think our way into right action; we act our way into right thinking."
          </p>
          <a
            href="https://calendly.com/michaelzick/45min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-xl"
          >
            Schedule Your Free Session with Michael
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 mt-12 mb-24">
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
        {currentStep.fields?.map((field: any) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2 text-dark-blue/80">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
              required
            />
          </div>
        ))}

        {currentStep.questions?.map((q: any) => (
          <div key={q.id}>
            <label className="block text-lg font-medium mb-3 text-dark-blue/90">
              {q.text}
            </label>
            {q.type === 'textarea' ? (
              <textarea
                name={q.id}
                value={formData.answers[q.id] || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
                required
              />
            ) : q.type === 'range' ? (
              <div className="space-y-4">
                <input
                  type="range"
                  name={q.id}
                  min={q.min}
                  max={q.max}
                  value={formData.answers[q.id] || 5}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
                />
                <div className="flex justify-between text-sm text-gray-500 font-medium px-1">
                  <span>None at all (1)</span>
                  <span>Full Ownership (10)</span>
                </div>
                <div className="text-center text-primary-blue font-bold text-xl">
                  {formData.answers[q.id] || 5}
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
          disabled={isSubmitting}
          className="btn !py-4 !px-12 text-lg disabled:opacity-50"
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
  );
}

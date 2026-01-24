'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { trackEvent } from '../lib/analytics';
import { Step, FormData } from '../lib/types';
import QuestionnaireAnalysis from './questionnaire/QuestionnaireAnalysis';
import QuestionnaireForm from './questionnaire/QuestionnaireForm';
import QuestionnaireFields from './questionnaire/QuestionnaireFields';
import { STEPS } from './questionnaire/steps';

export default function Questionnaire() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    answers: {},
  });
  const [honeypot, setHoneypot] = useState('');
  const [consented, setConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const currentStep = STEPS[stepIndex];

  const scrollToTop = useCallback(() => {
    if (stepIndex === 0 && !analysis) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const ref = analysis ? cardRef : containerRef;
    if (ref.current) {
      const yOffset = -120; // Account for sticky header (approx 80-100px)
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [stepIndex, analysis]);

  useEffect(() => {
    // Skip scroll on initial mount to avoid jumping on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Scroll for any step changes or when analysis appears
    scrollToTop();
  }, [stepIndex, analysis, scrollToTop]);

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
        body: JSON.stringify({ ...formData, website: honeypot }),
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
    return <QuestionnaireAnalysis analysis={analysis} cardRef={cardRef} />;
  }

  return (
    <QuestionnaireForm
      stepIndex={stepIndex}
      stepsCount={STEPS.length}
      currentStep={currentStep}
      cardRef={cardRef}
      containerRef={containerRef}
      honeypot={honeypot}
      setHoneypot={setHoneypot}
      error={error}
      isSubmitting={isSubmitting}
      isStepValid={isStepValid}
      prevStep={prevStep}
      nextStep={nextStep}
    >
      <QuestionnaireFields
        currentStep={currentStep}
        formData={formData}
        consented={consented}
        setConsented={setConsented}
        handleInputChange={handleInputChange}
      />
    </QuestionnaireForm>
  );
}

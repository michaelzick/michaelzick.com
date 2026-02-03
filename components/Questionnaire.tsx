'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { trackEvent } from '../lib/analytics';
import { Step, FormData } from '../lib/types';
import QuestionnaireAnalysis from './questionnaire/QuestionnaireAnalysis';
import QuestionnaireForm from './questionnaire/QuestionnaireForm';
import QuestionnaireFields from './questionnaire/QuestionnaireFields';
import { STEPS } from './questionnaire/steps';

const ANALYSIS_DURATION_STORAGE_KEY = 'questionnaire-analysis-duration-ms';
const DEFAULT_ANALYSIS_DURATION_MS = 35000;
const MIN_ANALYSIS_DURATION_MS = 10000;
const MAX_ANALYSIS_DURATION_MS = 120000;

function clampDuration(ms: number) {
  return Math.min(MAX_ANALYSIS_DURATION_MS, Math.max(MIN_ANALYSIS_DURATION_MS, ms));
}

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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [estimatedDurationMs, setEstimatedDurationMs] = useState(DEFAULT_ANALYSIS_DURATION_MS);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const submitStartedAtRef = useRef<number | null>(null);

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    const storedDuration = window.localStorage.getItem(ANALYSIS_DURATION_STORAGE_KEY);
    const parsedDuration = Number(storedDuration);
    if (Number.isFinite(parsedDuration)) {
      setEstimatedDurationMs(clampDuration(parsedDuration));
    }
  }, []);

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
    const submitStartedAt = Date.now();
    submitStartedAtRef.current = submitStartedAt;
    setAnalysisProgress(3);
    setSecondsRemaining(Math.ceil(estimatedDurationMs / 1000));
    setIsSubmitting(true);
    setError(null);
    trackEvent('questionnaire_submit', { email: formData.email });
    let submissionSucceeded = false;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const elapsedMs = Date.now() - submitStartedAt;
      const nextEstimateMs = clampDuration(
        Math.round(estimatedDurationMs * 0.65 + clampDuration(elapsedMs) * 0.35),
      );
      setEstimatedDurationMs(nextEstimateMs);
      window.localStorage.setItem(ANALYSIS_DURATION_STORAGE_KEY, String(nextEstimateMs));
      setAnalysisProgress(100);
      setSecondsRemaining(0);
      submissionSucceeded = true;
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      if (!submissionSucceeded) {
        setAnalysisProgress(0);
        setSecondsRemaining(null);
      }
      setIsSubmitting(false);
      submitStartedAtRef.current = null;
    }
  };

  useEffect(() => {
    if (!isSubmitting || submitStartedAtRef.current === null) return;

    const updateProgress = () => {
      if (submitStartedAtRef.current === null) return;

      const elapsedMs = Date.now() - submitStartedAtRef.current;
      const progressRatio = Math.min(elapsedMs / estimatedDurationMs, 0.97);
      const baseProgress = Math.max(3, Math.round(progressRatio * 100));
      const overflowProgress = Math.min(2, Math.floor(Math.max(0, elapsedMs - estimatedDurationMs) / 4000));
      const nextProgress = Math.min(99, baseProgress + overflowProgress);
      const remainingSeconds = Math.max(1, Math.ceil((estimatedDurationMs - elapsedMs) / 1000));

      setAnalysisProgress(nextProgress);
      setSecondsRemaining(remainingSeconds);
    };

    updateProgress();
    const intervalId = window.setInterval(updateProgress, 250);
    return () => window.clearInterval(intervalId);
  }, [isSubmitting, estimatedDurationMs]);

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
      analysisProgress={analysisProgress}
      secondsRemaining={secondsRemaining}
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

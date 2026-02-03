'use client';

import { Step } from '../../lib/types';

interface QuestionnaireFormProps {
  stepIndex: number;
  stepsCount: number;
  currentStep: Step;
  cardRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  honeypot: string;
  setHoneypot: (value: string) => void;
  error: string | null;
  isSubmitting: boolean;
  analysisProgress: number;
  secondsRemaining: number | null;
  isStepValid: () => boolean;
  prevStep: () => void;
  nextStep: () => void;
}

export default function QuestionnaireForm({
  stepIndex,
  stepsCount,
  currentStep,
  cardRef,
  containerRef,
  children,
  honeypot,
  setHoneypot,
  error,
  isSubmitting,
  analysisProgress,
  secondsRemaining,
  isStepValid,
  prevStep,
  nextStep,
}: QuestionnaireFormProps) {
  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      {/* Disclaimer Section */}
      <aside className="mb-6 p-4 bg-primary-blue/5 border border-primary-blue/10 rounded-lg text-sm text-default-grey/80">
        <p className="text-center font-bold mb-3 text-base">Notice</p>
        <div className="space-y-2 text-left">
          <p>
            This questionnaire uses AI (OpenAI) to analyze your responses and generate personalized coaching insights.
            Your responses and contact information will be securely emailed to Michael Zick for review. We value your privacy;
            your data is never shared with third parties and is kept strictly confidential.
          </p>
        </div>
      </aside>

      <div
        ref={cardRef}
        className="bg-white text-default-grey rounded-xl shadow-md ring-1 ring-black/5 p-6 sm:p-8"
      >
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-dark-blue/60 whitespace-nowrap">
              Step {stepIndex + 1} of {stepsCount}
            </span>
            <div className="h-2 w-full sm:w-48 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-blue transition-all duration-500"
                style={{ width: `${((stepIndex + 1) / stepsCount) * 100}%` }}
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-dark-blue">{currentStep.title}</h2>
        </div>

        {children}

        {/* Honeypot field - hidden from users */}
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', left: '-9999px' }} aria-hidden="true">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {isSubmitting && (
          <div className="mt-6 rounded-lg border border-primary-blue/20 bg-primary-blue/5 p-4">
            <div className="mb-2 flex items-center justify-between gap-4 text-sm font-semibold text-dark-blue/80">
              <span>Generating your AI analysis...</span>
              <span>{secondsRemaining !== null ? `~${secondsRemaining}s left` : 'Estimating...'}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary-blue/20">
              <div
                className="h-full bg-primary-blue transition-[width] duration-300 ease-linear"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
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
            {isSubmitting ? 'Analyzing...' : stepIndex === stepsCount - 1 ? (
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

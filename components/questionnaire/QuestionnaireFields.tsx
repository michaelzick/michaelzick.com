'use client';

import { FormData, Step } from '../../lib/types';

interface QuestionnaireFieldsProps {
  currentStep: Step;
  formData: FormData;
  consented: boolean;
  setConsented: (consented: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function QuestionnaireFields({
  currentStep,
  formData,
  consented,
  setConsented,
  handleInputChange,
}: QuestionnaireFieldsProps) {
  return (
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
            maxLength={field.maxLength}
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
              Your information is kept confidential and will not be shared with third parties.
            </span>
          </label>
        </div>
      )}

      {currentStep.questions?.map((q) => (
        <div key={q.id}>
          <div className="flex justify-between items-end mb-3">
            <label htmlFor={q.id} className="block text-lg font-medium text-dark-blue/90">
              {q.text}
            </label>
            {q.type === 'textarea' && q.maxLength && (
              <span className={`text-xs font-mono ${(formData.answers[q.id]?.length || 0) >= q.maxLength ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                {formData.answers[q.id]?.length || 0}/{q.maxLength}
              </span>
            )}
          </div>
          {q.type === 'textarea' ? (
            <textarea
              id={q.id}
              name={q.id}
              value={formData.answers[q.id] || ''}
              onChange={handleInputChange}
              rows={4}
              maxLength={q.maxLength}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
              required
              aria-required="true"
            />
          ) : q.type === 'range' ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <span className="bg-primary-blue/10 text-primary-blue px-4 py-1.5 rounded-full text-sm font-bold ring-1 ring-primary-blue/20">
                  Current Value: {formData.answers[q.id] || q.min}
                </span>
              </div>
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
              <div className="flex justify-between text-xs sm:text-sm font-bold text-dark-blue/70">
                <span className="flex flex-col items-start">
                  <span className="text-dark-blue">{q.min}</span>
                  <span>Victimhood</span>
                </span>
                <span className="flex flex-col items-end">
                  <span className="text-dark-blue">{q.max}</span>
                  <span>Ownership</span>
                </span>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

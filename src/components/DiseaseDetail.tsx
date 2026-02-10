'use client';

import { Disease, Treatment } from '@/src/types/medical';
import { TreatmentList } from './TreatmentList';
import { Activity, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { SpeechButton } from './SpeechButton';

interface DiseaseDetailProps {
  disease: Disease;
  treatments: Treatment[];
  loadingTreatments: boolean;
}

export function DiseaseDetail({
  disease,
  treatments,
  loadingTreatments,
}: DiseaseDetailProps) {
  const { content } = useLanguage();

  const diseaseContent = `
    ${disease.name}. 
    ${disease.description}
    ${content.ui.symptoms}: ${disease.symptoms.join(', ')}.
    ${
      disease.causes && disease.causes.length > 0
        ? `${content.ui.causes}: ${disease.causes.join(', ')}.`
        : ''
    }
  `;

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Disease Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {disease.name}
          </h2>

          <SpeechButton text={diseaseContent} className="flex-shrink-0" />
        </div>

        <p className="text-md sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          {disease.description}
        </p>
      </div>

      {/* Symptoms */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/15 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            {content.ui.symptoms}
          </h3>
        </div>

        <ul className="space-y-2">
          {disease.symptoms.map((symptom, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <span className="text-primary mt-1">•</span>
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Causes */}
      {disease.causes && disease.causes.length > 0 && (
        <div className="bg-accent/5 rounded-xl p-4 border border-accent/15 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-accent">
              {content.ui.causes}
            </h3>
          </div>

          <ul className="space-y-2">
            {disease.causes.map((cause, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-md text-gray-700 dark:text-gray-300"
              >
                <span className="text-accent mt-1">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Treatments */}
      {loadingTreatments ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <TreatmentList treatments={treatments} />
      )}
    </div>
  );
}

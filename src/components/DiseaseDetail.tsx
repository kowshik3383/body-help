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

export function DiseaseDetail({ disease, treatments, loadingTreatments }: DiseaseDetailProps) {
  const { content } = useLanguage();

  // Prepare speech content
  const diseaseContent = `
    ${disease.name}. 
    ${disease.description}
    ${content.ui.symptoms}: ${disease.symptoms.join(', ')}.
    ${disease.causes && disease.causes.length > 0 ? `${content.ui.causes}: ${disease.causes.join(', ')}.` : ''}
  `;

  return (
    <div className="space-y-6">
      {/* Disease name and description */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {disease.name}
          </h2>
          <SpeechButton text={diseaseContent} className="flex-shrink-0" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {disease.description}
        </p>
      </div>

      {/* Symptoms */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            {content.ui.symptoms}
          </h3>
        </div>
        <ul className="space-y-2">
          {disease.symptoms.map((symptom, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200"
            >
              <span className="text-red-600 dark:text-red-400 mt-1">•</span>
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Causes */}
      {disease.causes && disease.causes.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              {content.ui.causes}
            </h3>
          </div>
          <ul className="space-y-2">
            {disease.causes.map((cause, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200"
              >
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Treatments */}
      {loadingTreatments ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <TreatmentList treatments={treatments} />
      )}
    </div>
  );
}

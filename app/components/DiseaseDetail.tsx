'use client';

import { diseases } from '@/data/diseases';
import { TreatmentList } from './TreatmentList';
import { Activity, AlertCircle, ChevronLeft } from 'lucide-react';

interface DiseaseDetailProps {
  diseaseId: string;
  onBack: () => void;
}

export function DiseaseDetail({ diseaseId, onBack }: DiseaseDetailProps) {
  const disease = diseases[diseaseId];

  if (!disease) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back to diseases</span>
      </button>

      {/* Disease name */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {disease.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {disease.description}
        </p>
      </div>

      {/* Symptoms */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Symptoms
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
      {disease.causes.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Common Causes
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
      <TreatmentList treatmentIds={disease.treatments} />
    </div>
  );
}

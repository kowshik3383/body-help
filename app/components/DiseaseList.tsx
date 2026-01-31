'use client';

import { diseases } from '@/data/diseases';
import { ChevronRight } from 'lucide-react';

interface DiseaseListProps {
  diseaseIds: string[];
  onSelectDisease: (diseaseId: string) => void;
}

export function DiseaseList({ diseaseIds, onSelectDisease }: DiseaseListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Related Conditions
      </h3>
      <div className="space-y-2">
        {diseaseIds.map((diseaseId) => {
          const disease = diseases[diseaseId];
          if (!disease) return null;

          return (
            <button
              key={disease.id}
              onClick={() => onSelectDisease(disease.id)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {disease.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {disease.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

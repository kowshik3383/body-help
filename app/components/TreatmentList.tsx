'use client';

import { Treatment } from '@/types/medical';
import { Pill, Heart, Stethoscope, Scissors } from 'lucide-react';

interface TreatmentListProps {
  treatments: Treatment[];
}

export function TreatmentList({ treatments }: TreatmentListProps) {
  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-5 h-5" />;
      case 'lifestyle':
        return <Heart className="w-5 h-5" />;
      case 'therapy':
        return <Stethoscope className="w-5 h-5" />;
      case 'surgical':
        return <Scissors className="w-5 h-5" />;
      default:
        return <Pill className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'lifestyle':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'therapy':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'surgical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (!treatments || treatments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-300">
        No treatment information available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Treatment Options
      </h3>
      <div className="space-y-3">
        {treatments.map((treatment) => (
          <div
            key={treatment.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(treatment.type)}`}>
                {getTreatmentIcon(treatment.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {treatment.name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getTypeColor(treatment.type)}`}
                  >
                    {treatment.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {treatment.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

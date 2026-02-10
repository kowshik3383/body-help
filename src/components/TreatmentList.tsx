// Optimizations: Fixed JSX namespace issue, removed unnecessary spacing, improved type safety
'use client';

import { Treatment } from '@/src/types/medical';
import { Pill, Heart, Stethoscope, Scissors } from 'lucide-react';
import { FC } from 'react';

interface TreatmentListProps {
  treatments: Treatment[];
}

type TreatmentType = 'medication' | 'lifestyle' | 'therapy' | 'surgical';

interface TreatmentMeta {
  icon: FC<{ className?: string }>;
  tone: string;
}

export function TreatmentList({ treatments }: TreatmentListProps) {
  const getTreatmentMeta = (type: string): TreatmentMeta => {
    const baseIconClass = 'w-5 h-5';

    const config: Record<TreatmentType, TreatmentMeta> = {
      medication: {
        icon: ({ className }) => <Pill className={className || baseIconClass} />,
        tone: 'bg-primary/10 text-primary',
      },
      lifestyle: {
        icon: ({ className }) => <Heart className={className || baseIconClass} />,
        tone: 'bg-secondary/10 text-secondary',
      },
      therapy: {
        icon: ({ className }) => <Stethoscope className={className || baseIconClass} />,
        tone: 'bg-accent/10 text-accent',
      },
      surgical: {
        icon: ({ className }) => <Scissors className={className || baseIconClass} />,
        tone: 'bg-primary/20 text-primary',
      },
    };

    return config[type as TreatmentType] ?? config.medication;
  };

  if (!treatments || treatments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No treatment information available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">
        Treatment Options
      </h3>

      <div className="space-y-3">
        {treatments.map((treatment) => {
          const { icon: IconComponent, tone } = getTreatmentMeta(treatment.type);

          return (
            <div
              key={treatment.id}
              className="bg-surface rounded-xl p-4 border border-primary/15 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${tone}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {treatment.name}
                    </h4>

                    <span className={`text-xs px-2 py-1 rounded-full ${tone}`}>
                      {treatment.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {treatment.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

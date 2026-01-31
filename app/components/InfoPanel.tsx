'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { bodyParts } from '@/data/bodyParts';
import { DiseaseList } from './DiseaseList';
import { DiseaseDetail } from './DiseaseDetail';
import { X, RotateCw } from 'lucide-react';

interface InfoPanelProps {
  selectedBodyPart: string | null;
  selectedDisease: string | null;
  onSelectDisease: (diseaseId: string | null) => void;
  onClose: () => void;
}

export function InfoPanel({
  selectedBodyPart,
  selectedDisease,
  onSelectDisease,
  onClose,
}: InfoPanelProps) {
  const bodyPart = selectedBodyPart ? bodyParts[selectedBodyPart] : null;

  return (
    <AnimatePresence>
      {selectedBodyPart && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bodyPart?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Selected body part
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Reset button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full justify-center font-medium"
            >
              <RotateCw className="w-4 h-4" />
              Reset View
            </button>

            {/* Content */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {selectedDisease ? (
                <DiseaseDetail
                  diseaseId={selectedDisease}
                  onBack={() => onSelectDisease(null)}
                />
              ) : (
                bodyPart && (
                  <DiseaseList
                    diseaseIds={bodyPart.diseases}
                    onSelectDisease={onSelectDisease}
                  />
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

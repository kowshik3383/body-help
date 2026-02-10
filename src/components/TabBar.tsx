// Optimizations: Fixed hardcoded padding value, improved type safety
'use client';

import { motion } from 'framer-motion';
import { Activity, MessageSquare, Dumbbell } from 'lucide-react';
import { memo, useMemo } from 'react';

interface TabBarProps {
  activeTab: 'diseases' | 'exercise' | 'chat' | 'more' | 'explore';
  onTabChange: (tab: 'diseases' | 'exercise' | 'chat' | 'more' | 'explore') => void;
  diseasesLabel?: string;
  chatLabel?: string;
}

export const TabBar = memo(function TabBar({ 
  activeTab, 
  onTabChange, 
  diseasesLabel, 
  chatLabel 
}: TabBarProps) {
  const tabs = useMemo(() => [
    { id: 'diseases' as const, icon: Activity, label: diseasesLabel || 'Diseases' },
    { id: 'exercise' as const, icon: Dumbbell, label: 'Exercise' },
    { id: 'chat' as const, icon: MessageSquare, label: chatLabel || 'AI Chat' },
  ], [diseasesLabel, chatLabel]);

  return (
    <div
      className="pointer-events-none  inset-x-0 sticky bottom-0 left-0 right-0 z-50"
      style={{
        bottom: 'env(safe-area-inset-bottom, 0px)',
        paddingBottom: '8px',
      }}
    >
      <div className="pointer-events-auto  w-full flex justify-center">
        <div className="relative mb-2 flex items-center gap-8 px-10 py-3 rounded-full bg-blue-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                className="relative flex items-center justify-center w-10 h-10"
              >
                {/* Animated active background */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-3xl bg-blue-300 shadow-lg"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative z-10"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

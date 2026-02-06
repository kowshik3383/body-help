'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Activity } from 'lucide-react';

interface TabBarProps {
  activeTab: 'diseases' | 'chat';
  onTabChange: (tab: 'diseases' | 'chat') => void;
  diseasesLabel: string;
  chatLabel: string;
}

export function TabBar({
  activeTab,
  onTabChange,
  diseasesLabel,
  chatLabel,
}: TabBarProps) {
  const tabs = [
    {
      id: 'diseases' as const,
      label: diseasesLabel,
      icon: Activity,
    },
    {
      id: 'chat' as const,
      label: chatLabel,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-x-0 bottom-full h-12 bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-gray-950/80 dark:via-gray-950/40 pointer-events-none" />
      
      <div className="relative bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-gray-900/5 dark:shadow-gray-950/20">
        {/* Inner container with max-width for larger screens */}
        <div className="mx-auto max-w-md relative">
          <div className="flex items-stretch">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex-1 group touch-manipulation"
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative flex flex-col items-center justify-center gap-1 py-3 px-4 sm:py-4">
                    {/* Icon with scale animation */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.95,
                        y: isActive ? -2 : 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </motion.div>

                    {/* Label */}
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0.7,
                        fontWeight: isActive ? 600 : 500,
                      }}
                      className={`text-[10px] sm:text-xs transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </motion.span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </div>

                  {/* Ripple effect on tap */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.1 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Safe area spacer for devices with bottom notches */}
        <div className="h-safe-bottom bg-white dark:bg-gray-950" />
      </div>
    </div>
  );
}
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
    <div className="relative z-50">
      {/* Gradient fade overlay for smooth transition */}
      <div className="absolute inset-x-0 bottom-full h-8 sm:h-12 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-gray-950/90 dark:via-gray-950/50 pointer-events-none" />
      
      {/* Main Tab Bar Container with Glassmorphism */}
      <div className="relative bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-t border-gray-200/30 dark:border-gray-800/30 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
        {/* Decorative gradient line on top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        {/* Inner container with max-width for larger screens */}
        <div className="mx-auto max-w-md relative">
          <div className="flex items-stretch relative px-2 sm:px-4">
            {/* Background track */}
            <div className="absolute inset-2 sm:inset-3 bg-gray-100/50 dark:bg-gray-900/30 rounded-2xl sm:rounded-3xl" />
            
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
                  {/* Active background with glassmorphism */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-2 sm:inset-3 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 backdrop-blur-xl border border-white/50 dark:border-gray-700/50"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Hover effect */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-2 sm:inset-3 bg-gray-200/0 dark:bg-gray-700/0 rounded-xl sm:rounded-2xl group-hover:bg-gray-200/40 dark:group-hover:bg-gray-700/40 transition-colors duration-300"
                    />
                  )}

                  {/* Content */}
                  <div className="relative flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4">
                    {/* Icon container with gradient on active */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        y: isActive ? -2 : 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                      className="relative"
                    >
                      {/* Gradient glow behind active icon */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 rounded-lg blur-lg -z-10"
                        />
                      )}
                      
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </motion.div>

                    {/* Label with smooth animation */}
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0.7,
                        scale: isActive ? 1 : 0.95,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </motion.span>

                    {/* Active indicator line at bottom */}
                    {isActive && (
                      <motion.div
                        layoutId="activeLine"
                        className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 sm:w-12 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 shadow-sm"
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
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Safe area padding for devices with notches */}
        <div className="h-safe-bottom sm:h-2" />
      </div>

      {/* Decorative shimmer effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 skew-x-12"
        />
      </div>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  MessageSquare,
  Dumbbell,
  MoreHorizontal,
  Compass,
} from 'lucide-react';

interface TabBarProps {
  activeTab: 'diseases' | 'exercise' | 'chat' | 'more' | 'explore';
  onTabChange: (
    tab: 'diseases' | 'exercise' | 'chat' | 'more' | 'explore'
  ) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'diseases' as const, icon: Activity },
    { id: 'exercise' as const, icon: Dumbbell },
    { id: 'chat' as const, icon: MessageSquare },
    // Future-ready:
    // { id: 'explore' as const, icon: Compass },
    // { id: 'more' as const, icon: MoreHorizontal },
  ];

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex items-center gap-8 px-10 py-2 rounded-full bg-blue-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
  );
}
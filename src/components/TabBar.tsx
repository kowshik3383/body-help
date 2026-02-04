'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Activity } from 'lucide-react';

interface TabBarProps {
  activeTab: 'diseases' | 'chat';
  onTabChange: (tab: 'diseases' | 'chat') => void;
  diseasesLabel: string;
  chatLabel: string;
}

export function TabBar({ activeTab, onTabChange, diseasesLabel, chatLabel }: TabBarProps) {
  return (
    <div className="flex bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onTabChange('diseases')}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative ${
          activeTab === 'diseases'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <Activity className="w-5 h-5" />
        <span>{diseasesLabel}</span>
        {activeTab === 'diseases' && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            transition={{ duration: 0.2 }}
          />
        )}
      </button>

      <button
        onClick={() => onTabChange('chat')}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative ${
          activeTab === 'chat'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span>{chatLabel}</span>
        {activeTab === 'chat' && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            transition={{ duration: 0.2 }}
          />
        )}
      </button>
    </div>
  );
}

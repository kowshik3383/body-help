'use client';

import { ChatMessage as ChatMessageType } from '@/src/types/language';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-emerald-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div
        className={`flex-1 px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white ml-12'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mr-12'
        }`}
      >
        <p className="text-md leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

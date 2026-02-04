'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/src/hooks/useChat';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useVoiceInput } from '@/src/hooks/useVoiceInput';
import { ChatMessage } from './ChatMessage';

interface ChatPanelProps {
  bodyPart: string;
}

export function ChatPanel({ bodyPart }: ChatPanelProps) {
  const { language, content } = useLanguage();
  const { messages, isLoading, sendMessage } = useChat(bodyPart, language);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isListening, transcript, startListening, stopListening, clearTranscript, isSupported } = useVoiceInput(
    language,
    content.voiceCode
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    clearTranscript();
    await sendMessage(message);
    inputRef.current?.focus();
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      setInput('');
      startListening();
    }
  };

  const bodyPartContent = content.bodyParts[bodyPart];
  const bodyPartName = bodyPartContent?.name || bodyPart;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {content.ui.askAbout} {bodyPartName}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{content.ui.aiThinking}</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? content.ui.listening : content.ui.typeQuestion}
            disabled={isLoading || isListening}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm disabled:opacity-50"
          />
          {isSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
              title={isListening ? content.ui.stopListening : content.ui.speakToType}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}

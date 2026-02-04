'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '@/src/hooks/useSpeech';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface SpeechButtonProps {
  text: string;
  className?: string;
}

export function SpeechButton({ text, className = '' }: SpeechButtonProps) {
  const { language, content } = useLanguage();
  const { status, speak, stop } = useSpeech(language);

  const handleClick = () => {
    if (status === 'speaking') {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
      title={status === 'speaking' ? content.ui.stop : content.ui.listen}
    >
      {status === 'speaking' ? (
        <>
          <VolumeX className="w-4 h-4" />
          <span className="text-sm font-medium">{content.ui.stop}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          <span className="text-sm font-medium">{content.ui.listen}</span>
        </>
      )}
    </motion.button>
  );
}

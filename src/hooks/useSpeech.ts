'use client';

import { useState, useEffect, useRef } from 'react';
import { LanguageCode, SpeechStatus } from '@/src/types/language';
import { getLanguage } from '@/src/i18n';

export function useSpeech(language: LanguageCode) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language using voiceCode
    const voiceCode = getLanguage(language).voiceCode;
    utterance.lang = voiceCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setStatus('speaking');
  };

  return { status, speak, stop, pause, resume };
}

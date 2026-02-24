'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LanguageCode, LanguageContent } from '@/src/types/language';
import { getLanguage, defaultLanguage } from '@/src/i18n';

interface LanguageContextType {
  language: LanguageCode;
  content: LanguageContent;
  setLanguage: (lang: LanguageCode) => void;
  clearCache: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);
  const [content, setContent] = useState<LanguageContent>(getLanguage(defaultLanguage));

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('bodyhelp-language') as LanguageCode;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguageState(savedLang);
      setContent(getLanguage(savedLang));
    }
  }, []);

  const clearCache = useCallback(() => {
    // Clear local storage cache for diseases
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('disease-cache-')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      const previousLang = language;

      setLanguageState(lang);
      setContent(getLanguage(lang));
      localStorage.setItem('bodyhelp-language', lang);

      // If language changed, clear disease cache for instant update
      if (previousLang !== lang) {
        clearCache();

        // Trigger a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
      }
    },
    [language, clearCache]
  );

  return (
    <LanguageContext.Provider value={{ language, content, setLanguage, clearCache }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

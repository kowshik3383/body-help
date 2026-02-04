'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageContent } from '@/src/types/language';
import { getLanguage, defaultLanguage } from '@/src/i18n';

interface LanguageContextType {
  language: LanguageCode;
  content: LanguageContent;
  setLanguage: (lang: LanguageCode) => void;
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

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setContent(getLanguage(lang));
    localStorage.setItem('bodyhelp-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, content, setLanguage }}>
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

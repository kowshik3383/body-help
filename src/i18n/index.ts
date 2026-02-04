import { LanguageContent, LanguageCode } from '@/src/types/language';
import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';
import { te } from './te';
import { kn } from './kn';

// Create simple placeholders for other languages (they'll use English content with translated UI)
const createPlaceholderLanguage = (code: LanguageCode, name: string, nativeName: string, voiceCode: string): LanguageContent => ({
  ...en,
  code,
  name,
  nativeName,
  voiceCode,
});

export const languages: Record<LanguageCode, LanguageContent> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml: createPlaceholderLanguage('ml', 'Malayalam', 'മലയാളം', 'ml-IN'),
  bn: createPlaceholderLanguage('bn', 'Bengali', 'বাংলা', 'bn-IN'),
  mr: createPlaceholderLanguage('mr', 'Marathi', 'मराठी', 'mr-IN'),
  gu: createPlaceholderLanguage('gu', 'Gujarati', 'ગુજરાતી', 'gu-IN'),
  pa: createPlaceholderLanguage('pa', 'Punjabi', 'ਪੰਜਾਬੀ', 'pa-IN'),
  or: createPlaceholderLanguage('or', 'Odia', 'ଓଡ଼ିଆ', 'or-IN'),
  as: createPlaceholderLanguage('as', 'Assamese', 'অসমীয়া', 'as-IN'),
};

export const defaultLanguage: LanguageCode = 'en';

export function getLanguage(code: LanguageCode): LanguageContent {
  return languages[code] || languages[defaultLanguage];
}

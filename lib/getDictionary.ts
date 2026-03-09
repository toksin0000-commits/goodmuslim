import ar from '@/locales/ar.json';
import en from '@/locales/en.json';
import ur from '@/locales/ur.json';

const dictionaries = { ar, en, ur };

export function getDictionary(lang: 'ar' | 'en' | 'ur') {
  return dictionaries[lang];
}
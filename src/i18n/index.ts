import { LanguageCode } from '../types';
import { bn } from './locales/bn';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { ta } from './locales/ta';
import { te } from './locales/te';
import { TranslationDictionary } from './types';

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en,
  ta,
  hi,
  te,
  ml,
  kn,
  bn,
};

export function isSupportedLanguage(code: unknown): code is LanguageCode {
  return (
    typeof code === 'string' &&
    Object.prototype.hasOwnProperty.call(TRANSLATIONS, code)
  );
}

export function getTranslation(code: LanguageCode): TranslationDictionary {
  return TRANSLATIONS[code] ?? TRANSLATIONS.en;
}

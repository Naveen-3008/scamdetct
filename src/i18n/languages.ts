import { LanguageCode } from '../types';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  bcp47: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', bcp47: 'en-IN' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', bcp47: 'ta-IN' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', bcp47: 'hi-IN' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', bcp47: 'te-IN' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', bcp47: 'ml-IN' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', bcp47: 'kn-IN' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', bcp47: 'bn-IN' },
];

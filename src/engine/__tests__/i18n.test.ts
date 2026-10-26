import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TRANSLATIONS } from '../../i18n';
import { LanguageCode } from '../../types';
import { scanMessage } from '../scamScanner';

function collectStrings(obj: unknown, path = ''): Array<{ path: string; value: string }> {
  if (typeof obj === 'string') {
    return [{ path, value: obj }];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((item, idx) => collectStrings(item, `${path}[${idx}]`));
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) =>
      collectStrings(v, path ? `${path}.${k}` : k)
    );
  }
  return [];
}

describe('ElderShield Seven-Language Translations', () => {
  const languages: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'ml', 'kn', 'bn'];

  it('has non-empty translations for every single key across all 7 languages', () => {
    const enEntries = collectStrings(TRANSLATIONS.en);
    assert.ok(enEntries.length > 120, 'Should have comprehensive translation entries');

    for (const lang of languages) {
      const dict = TRANSLATIONS[lang];
      assert.ok(dict, `Missing dictionary for ${lang}`);
      const entries = collectStrings(dict);
      assert.equal(
        entries.length,
        enEntries.length,
        `Key count mismatch for ${lang}`
      );
      for (const entry of entries) {
        assert.ok(
          entry.value.trim().length > 0,
          `Empty translation string at ${lang}.${entry.path}`
        );
      }
    }
  });

  it('uses authentic native Unicode scripts for each Indian language including spoken audio strings', () => {
    const scriptRegexes: Record<Exclude<LanguageCode, 'en'>, RegExp> = {
      ta: /[\u0B80-\u0BFF]/, // Tamil block
      hi: /[\u0900-\u097F]/, // Devanagari block
      te: /[\u0C00-\u0C7F]/, // Telugu block
      ml: /[\u0D00-\u0D7F]/, // Malayalam block
      kn: /[\u0C80-\u0CFF]/, // Kannada block
      bn: /[\u0980-\u09FF]/, // Bengali block
    };

    for (const [lang, scriptRegex] of Object.entries(scriptRegexes) as Array<
      [Exclude<LanguageCode, 'en'>, RegExp]
    >) {
      const dict = TRANSLATIONS[lang];
      assert.match(dict.nav.scanner, scriptRegex, `${lang} nav.scanner must use native script`);
      assert.match(dict.home.welcomeTitle, scriptRegex, `${lang} welcomeTitle must use native script`);
      assert.match(dict.classifications.LIKELY_SCAM, scriptRegex, `${lang} LIKELY_SCAM must use native script`);
      assert.match(dict.voice.spokenIntroLikely, scriptRegex, `${lang} spokenIntroLikely must use native script`);
      assert.match(dict.voice.spokenIntroSuspicious, scriptRegex, `${lang} spokenIntroSuspicious must use native script`);
      assert.match(dict.voice.spokenIntroNoObvious, scriptRegex, `${lang} spokenIntroNoObvious must use native script`);
      assert.match(dict.voice.spokenOutroSafety, scriptRegex, `${lang} spokenOutroSafety must use native script`);
      assert.match(dict.voice.testSampleSpeech, scriptRegex, `${lang} testSampleSpeech must use native script`);
      assert.equal(dict.safetyGuide.topics.length, 8, `${lang} must have all 8 safety guide topics`);
    }
  });

  it('classifies all 7 languages sampleMessages[0..2] into Likely Scam, Suspicious, and No Obvious Scam', () => {
    for (const lang of languages) {
      const [scamSample, suspiciousSample, safeSample] =
        TRANSLATIONS[lang].scanner.sampleMessages;

      const resScam = scanMessage(scamSample);
      const resSuspicious = scanMessage(suspiciousSample);
      const resSafe = scanMessage(safeSample);

      assert.equal(
        resScam.classification,
        'LIKELY_SCAM',
        `${lang} sampleMessages[0] should classify as LIKELY_SCAM`
      );
      assert.equal(
        resSuspicious.classification,
        'SUSPICIOUS',
        `${lang} sampleMessages[1] should classify as SUSPICIOUS`
      );
      assert.equal(
        resSafe.classification,
        'NO_OBVIOUS_SCAM',
        `${lang} sampleMessages[2] should classify as NO_OBVIOUS_SCAM`
      );
    }
  });
});

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LanguageCode } from '../types';

export type SpeechSupportState =
  | 'unsupported'
  | 'missing_language_voice'
  | 'ready'
  | 'speaking';

interface UseSpeechOptions {
  language: LanguageCode;
  rate: number;
  volume: number;
}

const PRIMARY_BCP47: Record<LanguageCode, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
};

const LANGUAGE_VOICE_PREFIXES: Record<LanguageCode, string[]> = {
  en: ['en-in', 'en-gb', 'en-us', 'en-au', 'en'],
  ta: ['ta-in', 'ta-lk', 'ta-sg', 'ta-my', 'ta', 'tam'],
  hi: ['hi-in', 'hi', 'hin'],
  te: ['te-in', 'te', 'tel'],
  ml: ['ml-in', 'ml', 'mal'],
  kn: ['kn-in', 'kn', 'kan'],
  bn: ['bn-in', 'bn-bd', 'bn', 'ben'],
};

const LANGUAGE_NAME_HINTS: Record<LanguageCode, string[]> = {
  en: ['english', 'neerja', 'prabhat', 'rishi', 'veena'],
  ta: ['tamil', 'தமிழ்', 'valluvar', 'pallavi', 'vani'],
  hi: ['hindi', 'हिन्दी', 'हिंदी', 'swara', 'madhur', 'kalpana', 'hemant', 'lekha', 'kiyara', 'neel'],
  te: ['telugu', 'తెలుగు', 'shruti', 'mohan', 'chitra', 'geeta'],
  ml: ['malayalam', 'മലയാളം', 'sobhana', 'midhun'],
  kn: ['kannada', 'ಕನ್ನಡ', 'sapna', 'gagan', 'soumya'],
  bn: ['bengali', 'bangla', 'বাংলা', 'tanishaa', 'bashkar', 'nabanita', 'pradeep', 'piya'],
};

function normalizeLangTag(tag: string): string {
  return (tag || '').trim().toLowerCase().replace(/_/g, '-');
}

function findMatchingVoice(
  voices: SpeechSynthesisVoice[],
  language: LanguageCode
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const prefixes = LANGUAGE_VOICE_PREFIXES[language];
  const nameHints = LANGUAGE_NAME_HINTS[language];

  // 1. Exact BCP-47 tag match in priority order (e.g. ta-IN before generic ta)
  for (const prefix of prefixes) {
    const exact = voices.find((v) => normalizeLangTag(v.lang) === prefix);
    if (exact) return exact;
  }

  // 2. Prefix match on language subtag (e.g. ta-*, tam-*)
  for (const prefix of prefixes) {
    const subtagMatch = voices.find((v) => {
      const norm = normalizeLangTag(v.lang);
      return norm === prefix || norm.startsWith(`${prefix}-`);
    });
    if (subtagMatch) return subtagMatch;
  }

  // 3. Voice name explicitly mentions the target language or known OS voice name
  const nameMatch = voices.find((v) => {
    const lowerName = (v.name || '').toLowerCase();
    return nameHints.some((hint) => lowerName.includes(hint));
  });
  if (nameMatch) return nameMatch;

  // Never substitute an English voice when an Indian language voice is unavailable
  return null;
}

export function useSpeech({ language, rate, volume }: UseSpeechOptions) {
  const isBrowserSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  // Keep strong ref to active utterance so Chromium V8 GC never collects it mid-playback
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTimerRef = useRef<number | null>(null);

  const refreshVoices = useCallback(() => {
    if (!isBrowserSupported) return;
    try {
      const available = window.speechSynthesis.getVoices();
      if (Array.isArray(available)) {
        setVoices(available);
      }
    } catch {
      setVoices([]);
    }
  }, [isBrowserSupported]);

  useEffect(() => {
    if (!isBrowserSupported) return;
    refreshVoices();

    const synth = window.speechSynthesis;
    synth.addEventListener('voiceschanged', refreshVoices);

    const timer1 = window.setTimeout(refreshVoices, 250);
    const timer2 = window.setTimeout(refreshVoices, 1000);

    return () => {
      synth.removeEventListener('voiceschanged', refreshVoices);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [isBrowserSupported, refreshVoices]);

  const clearPendingTimer = useCallback(() => {
    if (speakTimerRef.current !== null) {
      window.clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    clearPendingTimer();
    if (!isBrowserSupported) return;
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Ignore synthesis cancel errors
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [isBrowserSupported, clearPendingTimer]);

  // Cancel ongoing speech when language changes or component unmounts
  useEffect(() => {
    stopSpeaking();
    setLastSpokenText('');
  }, [language, stopSpeaking]);

  useEffect(() => {
    return () => {
      clearPendingTimer();
      if (isBrowserSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore
        }
      }
    };
  }, [isBrowserSupported, clearPendingTimer]);

  const matchedVoice = useMemo(
    () => findMatchingVoice(voices, language),
    [voices, language]
  );

  // On Android Chrome / mobile WebViews, getVoices() often returns [] while OS TTS handles utterance.lang natively.
  const canAttemptOsRouting = isBrowserSupported && voices.length === 0;

  const supportState: SpeechSupportState = useMemo(() => {
    if (!isBrowserSupported) return 'unsupported';
    if (isSpeaking) return 'speaking';
    if (matchedVoice || canAttemptOsRouting) return 'ready';
    return 'missing_language_voice';
  }, [isBrowserSupported, isSpeaking, matchedVoice, canAttemptOsRouting]);

  const speak = useCallback(
    (text: string): boolean => {
      const trimmed = text.trim();
      if (!trimmed || !isBrowserSupported) {
        return false;
      }

      clearPendingTimer();

      let liveVoices: SpeechSynthesisVoice[] = voices;
      try {
        const fetched = window.speechSynthesis.getVoices();
        if (Array.isArray(fetched) && fetched.length > 0) {
          liveVoices = fetched;
          if (voices.length === 0) {
            setVoices(fetched);
          }
        }
      } catch {
        // Ignore getVoices error
      }

      const targetVoice = findMatchingVoice(liveVoices, language);

      // If desktop browser enumerated voices and none match the selected language,
      // do not force an incompatible English voice; let UI show missing-voice guidance.
      if (liveVoices.length > 0 && !targetVoice) {
        setIsSpeaking(false);
        return false;
      }

      const enqueueUtterance = () => {
        try {
          const synth = window.speechSynthesis;
          if (synth.paused) {
            synth.resume();
          }

          const utterance = new window.SpeechSynthesisUtterance(trimmed);
          if (targetVoice) {
            utterance.voice = targetVoice;
            utterance.lang = targetVoice.lang || PRIMARY_BCP47[language];
          } else {
            // Mobile / OS-delegated speech engine routing via BCP-47 language tag
            utterance.lang = PRIMARY_BCP47[language];
          }

          utterance.rate = Math.min(1.5, Math.max(0.5, rate));
          utterance.volume = Math.min(1.0, Math.max(0.1, volume));

          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => {
            if (utteranceRef.current === utterance) {
              utteranceRef.current = null;
            }
            setIsSpeaking(false);
          };
          utterance.onerror = () => {
            if (utteranceRef.current === utterance) {
              utteranceRef.current = null;
            }
            setIsSpeaking(false);
          };

          utteranceRef.current = utterance;
          setLastSpokenText(trimmed);
          setIsSpeaking(true);
          synth.speak(utterance);
        } catch {
          setIsSpeaking(false);
        }
      };

      try {
        const synth = window.speechSynthesis;
        if (synth.speaking || synth.pending) {
          // Cancel previous speech first, then wait briefly to avoid Chromium cancel+speak drop bug
          synth.cancel();
          speakTimerRef.current = window.setTimeout(() => {
            speakTimerRef.current = null;
            enqueueUtterance();
          }, 60);
        } else {
          // Speak synchronously inside the user's Check Message click gesture
          enqueueUtterance();
        }
        return true;
      } catch {
        setIsSpeaking(false);
        return false;
      }
    },
    [isBrowserSupported, clearPendingTimer, voices, language, rate, volume]
  );

  const replay = useCallback(
    (fallbackText?: string): boolean => {
      const target = lastSpokenText || fallbackText || '';
      if (!target) return false;
      return speak(target);
    },
    [lastSpokenText, speak]
  );

  return {
    isBrowserSupported,
    matchedVoice,
    supportState,
    isSpeaking,
    canReplay:
      Boolean(lastSpokenText) && Boolean(matchedVoice || canAttemptOsRouting),
    speak,
    replay,
    stopSpeaking,
  };
}

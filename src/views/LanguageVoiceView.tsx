import { Check } from 'lucide-react';
import React from 'react';
import { VoiceControlsCard } from '../components/VoiceControlsCard';
import { SpeechSupportState } from '../hooks/useSpeech';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/types';
import { LanguageCode, UserPreferences } from '../types';

interface LanguageVoiceViewProps {
  t: TranslationDictionary;
  preferences: UserPreferences;
  onSelectLanguage: (lang: LanguageCode) => void;
  onUpdatePreferences: (partial: Partial<UserPreferences>) => void;
  speech: {
    supportState: SpeechSupportState;
    matchedVoiceName: string | null;
    isSpeaking: boolean;
    canReplay: boolean;
    speak: (text: string) => boolean;
    replay: (fallback?: string) => boolean;
    stopSpeaking: () => void;
  };
}

export const LanguageVoiceView: React.FC<LanguageVoiceViewProps> = ({
  t,
  preferences,
  onSelectLanguage,
  onUpdatePreferences,
  speech,
}) => {
  return (
    <div className="space-y-7 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          {t.languagePage.title}
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
          {t.languagePage.subtitle}
        </p>
      </div>

      {/* Seven-Language Selection Grid */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {t.languagePage.selectLanguageHeading}
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch"
          role="radiogroup"
          aria-label={t.languagePage.selectLanguageHeading}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = preferences.language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectLanguage(lang.code)}
                className={`min-h-[76px] p-4 sm:p-5 rounded-2xl border text-left flex flex-wrap items-center justify-between gap-2.5 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/80 text-slate-900'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {lang.nativeName}
                  </p>
                  <p className="text-sm sm:text-base text-slate-600 mt-0.5">
                    {lang.englishName}
                  </p>
                </div>

                {isSelected && (
                  <span className="inline-flex items-center gap-1.5 text-teal-800 font-semibold text-sm sm:text-base shrink-0">
                    <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{t.languagePage.activeBadgeText}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Spoken Voice Settings & Test */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.languagePage.voiceSettingsHeading}
          </h2>
          <p className="mt-1 text-lg text-slate-700 max-w-3xl">
            {t.languagePage.voiceSettingsDesc}
          </p>
        </div>

        <VoiceControlsCard
          t={t}
          supportState={speech.supportState}
          matchedVoiceName={speech.matchedVoiceName}
          isSpeaking={speech.isSpeaking}
          canReplay={speech.canReplay}
          rate={preferences.speechRate}
          volume={preferences.speechVolume}
          autoSpeak={preferences.autoSpeakResult}
          onAutoSpeakChange={(autoSpeakResult) =>
            onUpdatePreferences({ autoSpeakResult })
          }
          onRateChange={(speechRate) => onUpdatePreferences({ speechRate })}
          onVolumeChange={(speechVolume) =>
            onUpdatePreferences({ speechVolume })
          }
          onReplay={() => speech.replay(t.voice.testSampleSpeech)}
          onStop={speech.stopSpeaking}
          onTestVoice={() => speech.speak(t.voice.testSampleSpeech)}
          showSettingsControls={true}
        />
      </section>
    </div>
  );
};

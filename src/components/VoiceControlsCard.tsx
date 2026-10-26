import {
  Info,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React from 'react';
import { SpeechSupportState } from '../hooks/useSpeech';
import { TranslationDictionary } from '../i18n/types';

interface VoiceControlsCardProps {
  t: TranslationDictionary;
  supportState: SpeechSupportState;
  matchedVoiceName: string | null;
  isSpeaking: boolean;
  canReplay: boolean;
  rate: number;
  volume: number;
  autoSpeak: boolean;
  onAutoSpeakChange: (autoSpeak: boolean) => void;
  onRateChange: (rate: number) => void;
  onVolumeChange: (volume: number) => void;
  onSpeakPrimary?: () => void;
  onReplay: () => void;
  onStop: () => void;
  onTestVoice: () => void;
  showSettingsControls?: boolean;
}

export const VoiceControlsCard: React.FC<VoiceControlsCardProps> = ({
  t,
  supportState,
  matchedVoiceName,
  isSpeaking,
  canReplay,
  rate,
  volume,
  autoSpeak,
  onAutoSpeakChange,
  onRateChange,
  onVolumeChange,
  onSpeakPrimary,
  onReplay,
  onStop,
  onTestVoice,
  showSettingsControls = true,
}) => {
  const voiceReady =
    supportState === 'ready' || supportState === 'speaking';

  const rateOptions = [
    { value: 0.8, label: t.voice.rateSlow },
    { value: 0.95, label: t.voice.rateNormal },
    { value: 1.0, label: t.voice.rateClear },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
        <h4 className="text-xl font-bold text-slate-900">
          {t.voice.sectionTitle}
        </h4>
        <div
          className="text-sm sm:text-base text-slate-600 flex items-baseline gap-1.5 flex-wrap min-w-0"
          aria-live="polite"
        >
          <span className="font-medium text-slate-700">
            {t.voice.statusLabel}:
          </span>
          {supportState === 'speaking' && (
            <span className="font-semibold text-teal-800">
              {t.voice.statusSpeaking}
            </span>
          )}
          {supportState === 'ready' && (
            <span className="text-teal-800 font-medium min-w-0">
              {t.voice.statusReady}
              {matchedVoiceName ? ` · ${matchedVoiceName}` : ''}
            </span>
          )}
          {supportState === 'missing_language_voice' && (
            <span className="text-amber-800 font-medium">
              {t.voice.statusMissingVoiceTitle}
            </span>
          )}
          {supportState === 'unsupported' && (
            <span className="text-slate-600">{t.voice.statusUnsupported}</span>
          )}
        </div>
      </div>

      {/* Action Buttons: Symmetrical full-width / 2-col layout on mobile, inline flex on tablet/desktop */}
      <div className="mt-5 grid grid-cols-1 min-[380px]:grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
        {onSpeakPrimary && (
          <button
            type="button"
            onClick={onSpeakPrimary}
            disabled={!voiceReady}
            className="min-[380px]:col-span-2 inline-flex items-center justify-center gap-2.5 min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-lg text-center hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <Volume2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{t.voice.speakWarningBtn}</span>
          </button>
        )}

        {!onSpeakPrimary && (
          <button
            type="button"
            onClick={onTestVoice}
            disabled={!voiceReady}
            className="min-[380px]:col-span-2 inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-teal-700 bg-teal-50/70 text-teal-900 font-semibold text-base text-center hover:bg-teal-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <Play className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{t.voice.testVoiceBtn}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReplay}
          disabled={!voiceReady || (!canReplay && !onSpeakPrimary)}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base text-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
        >
          <RotateCcw className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="leading-snug">{t.voice.replayBtn}</span>
        </button>

        <button
          type="button"
          onClick={onStop}
          disabled={!isSpeaking}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base text-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
        >
          <Square className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="leading-snug">{t.voice.stopBtn}</span>
        </button>

        {onSpeakPrimary && (
          <button
            type="button"
            onClick={onTestVoice}
            disabled={!voiceReady}
            className="min-[380px]:col-span-2 inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-teal-700 bg-teal-50/70 text-teal-900 font-semibold text-base text-center hover:bg-teal-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <Play className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{t.voice.testVoiceBtn}</span>
          </button>
        )}
      </div>

      {/* Guidance when selected language voice pack is missing */}
      {supportState === 'missing_language_voice' && (
        <div
          className="mt-5 rounded-xl border border-amber-300 bg-amber-50/70 p-4 text-slate-800"
          role="status"
        >
          <div className="flex items-start gap-3">
            <VolumeX
              className="w-6 h-6 text-amber-800 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-2 text-base sm:text-lg min-w-0">
              <p className="font-bold text-amber-950">
                {t.voice.statusMissingVoiceTitle}
              </p>
              <p>{t.voice.statusMissingVoiceBody}</p>
              <p className="text-slate-700">{t.voice.statusInstallHint}</p>
            </div>
          </div>
        </div>
      )}

      {supportState === 'unsupported' && (
        <div
          className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-4 text-base sm:text-lg text-slate-700"
          role="status"
        >
          {t.voice.statusUnsupported}
        </div>
      )}

      {/* Auto-Speak Preference Toggle */}
      <div className="mt-5 pt-4 border-t border-slate-200">
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => onAutoSpeakChange(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-400 text-teal-700 focus:ring-teal-700 shrink-0"
          />
          <span className="text-base sm:text-lg text-slate-800 font-medium leading-snug">
            {t.voice.autoSpeakLabel}
          </span>
        </label>
      </div>

      {/* Speech Rate and Volume Settings */}
      {showSettingsControls && (
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-base font-semibold text-slate-800 mb-2">
              {t.voice.rateLabel}
            </span>
            <div
              className="grid grid-cols-1 min-[440px]:grid-cols-3 sm:inline-flex sm:flex-wrap gap-2 w-full sm:w-auto"
              role="group"
              aria-label={t.voice.rateLabel}
            >
              {rateOptions.map((opt) => {
                const active = Math.abs(rate - opt.value) < 0.03;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onRateChange(opt.value)}
                    aria-pressed={active}
                    className={`min-h-[48px] px-4 py-2 rounded-xl font-semibold text-base text-center border transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-1 ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="eldershield-voice-volume"
              className="flex items-center justify-between gap-2 text-base font-semibold text-slate-800 mb-2"
            >
              <span>{t.voice.volumeLabel}</span>
              <span className="tabular-nums font-mono text-slate-700 shrink-0">
                {Math.round(volume * 100)}%
              </span>
            </label>
            <input
              id="eldershield-voice-volume"
              type="range"
              min={0.2}
              max={1.0}
              step={0.1}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full h-3 accent-teal-700 cursor-pointer rounded-lg bg-slate-200"
            />
          </div>
        </div>
      )}

      <p className="mt-4 text-sm sm:text-base text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-1 text-slate-500" aria-hidden="true" />
        <span>{t.voice.limitationNote}</span>
      </p>
    </div>
  );
};

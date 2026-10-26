import {
  AlertCircle,
  CheckCircle2,
  Eraser,
  FileText,
  Info,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ClassificationBanner } from '../components/ClassificationBanner';
import { VoiceControlsCard } from '../components/VoiceControlsCard';
import { MAX_MESSAGE_LENGTH, scanMessage } from '../engine/scamScanner';
import { SpeechSupportState } from '../hooks/useSpeech';
import { TranslationDictionary } from '../i18n/types';
import { ScanResult, UserPreferences } from '../types';

interface ScannerViewProps {
  t: TranslationDictionary;
  initialMessage: string;
  autoRunInitial: boolean;
  onConsumeInitial: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (partial: Partial<UserPreferences>) => void;
  onRecordScan: (result: ScanResult, rawMessage: string) => void;
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

export const ScannerView: React.FC<ScannerViewProps> = ({
  t,
  initialMessage,
  autoRunInitial,
  onConsumeInitial,
  preferences,
  onUpdatePreferences,
  onRecordScan,
  speech,
}) => {
  const [messageText, setMessageText] = useState(initialMessage);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const resultPanelRef = useRef<HTMLDivElement | null>(null);

  const buildSpokenResultText = (res: ScanResult): string => {
    const parts: string[] = [];
    if (res.classification === 'LIKELY_SCAM') {
      parts.push(t.voice.spokenIntroLikely);
    } else if (res.classification === 'SUSPICIOUS') {
      parts.push(t.voice.spokenIntroSuspicious);
    } else {
      parts.push(t.voice.spokenIntroNoObvious);
    }

    if (res.warningSigns.length > 0) {
      const ruleTitles = res.warningSigns
        .slice(0, 3)
        .map((w) => t.rules[w.ruleId].title);
      parts.push(ruleTitles.join('. ') + '.');
    }

    parts.push(t.voice.spokenOutroSafety);
    return parts.join(' ');
  };

  const executeScan = (input: string) => {
    const scanRes = scanMessage(input);
    if (!scanRes.isValid) {
      speech.stopSpeaking();
      setResult(null);
      if (scanRes.validationError === 'TOO_LONG') {
        setErrorMessage(t.scanner.errorTooLong);
      } else {
        setErrorMessage(t.scanner.errorEmpty);
      }
      return;
    }

    setErrorMessage(null);
    setResult(scanRes);
    onRecordScan(scanRes, input);

    // Automatically play spoken result in the selected native language
    // both when the message is a scam/suspicious AND when no obvious scam is detected.
    if (preferences.autoSpeakResult) {
      speech.speak(buildSpokenResultText(scanRes));
    } else {
      speech.stopSpeaking();
    }

    window.setTimeout(() => {
      resultPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 60);
  };

  useEffect(() => {
    if (initialMessage) {
      setMessageText(initialMessage);
      if (autoRunInitial) {
        executeScan(initialMessage);
      }
      onConsumeInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, autoRunInitial]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeScan(messageText);
  };

  const handleClear = () => {
    speech.stopSpeaking();
    setMessageText('');
    setResult(null);
    setErrorMessage(null);
  };

  const handleLoadExample = () => {
    speech.stopSpeaking();
    const samples = t.scanner.sampleMessages;
    const chosen = samples[exampleIndex % samples.length];
    setExampleIndex((prev) => (prev + 1) % samples.length);
    setMessageText(chosen);
    setErrorMessage(null);
    setResult(null);
  };

  const getSummaryForClassification = (res: ScanResult): string => {
    if (res.classification === 'LIKELY_SCAM') {
      return t.scanner.summaryLikelyScam;
    }
    if (res.classification === 'SUSPICIOUS') {
      return t.scanner.summarySuspicious;
    }
    return t.scanner.summaryNoObvious;
  };

  const getNextSteps = (res: ScanResult): string[] => {
    if (res.classification === 'LIKELY_SCAM') {
      return t.scanner.stepsLikelyScam;
    }
    if (res.classification === 'SUSPICIOUS') {
      return t.scanner.stepsSuspicious;
    }
    return t.scanner.stepsNoObvious;
  };

  return (
    <div className="space-y-7 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          {t.scanner.title}
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-slate-700 leading-relaxed max-w-3xl">
          {t.scanner.subtitle}
        </p>
      </div>

      {/* Scanner Input Card */}
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 space-y-6"
      >
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 mb-2.5">
            <label
              htmlFor="scanner-message-textarea"
              className="text-lg sm:text-xl font-bold text-slate-900"
            >
              {t.scanner.inputLabel}
            </label>
            <span className="text-sm sm:text-base text-slate-600 tabular-nums font-mono">
              {messageText.length} / {MAX_MESSAGE_LENGTH} {t.scanner.charCountLabel}
            </span>
          </div>

          <textarea
            id="scanner-message-textarea"
            rows={6}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={t.scanner.inputPlaceholder}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? 'scanner-input-error' : undefined}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 sm:p-5 text-lg sm:text-xl text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-3 focus:ring-teal-700/20 leading-relaxed"
          />

          {errorMessage && (
            <div
              id="scanner-input-error"
              role="alert"
              className="mt-3 rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3 text-red-900 text-base sm:text-lg font-medium"
            >
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-red-700" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Action Buttons: Full-width aligned stack on mobile, inline flex on tablet/desktop */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-3.5">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[52px] px-6 sm:px-7 py-3 rounded-xl bg-teal-700 text-white font-semibold text-lg text-center hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <ShieldCheck className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{t.scanner.checkBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleLoadExample}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-lg text-center hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <FileText className="w-5 h-5 shrink-0 text-teal-800" aria-hidden="true" />
            <span className="leading-snug">{t.scanner.exampleBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={messageText.length === 0 && !result}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-lg text-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <Eraser className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{t.scanner.clearBtn}</span>
          </button>
        </div>

        {/* Voice Auto-Play & History Privacy Consent Controls */}
        <fieldset className="pt-5 border-t border-slate-200 space-y-3">
          <legend className="text-base font-bold text-slate-800 mb-2">
            {t.scanner.historyConsentGroupLabel}
          </legend>

          <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
            <input
              type="checkbox"
              checked={preferences.autoSpeakResult}
              onChange={(e) =>
                onUpdatePreferences({ autoSpeakResult: e.target.checked })
              }
              className="mt-1 h-5 w-5 rounded border-slate-400 text-teal-700 focus:ring-teal-700 shrink-0"
            />
            <span className="text-base sm:text-lg text-slate-800 font-medium leading-snug">
              {t.voice.autoSpeakLabel}
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
            <input
              type="checkbox"
              checked={preferences.enableHistory}
              onChange={(e) =>
                onUpdatePreferences({ enableHistory: e.target.checked })
              }
              className="mt-1 h-5 w-5 rounded border-slate-400 text-teal-700 focus:ring-teal-700 shrink-0"
            />
            <span className="text-base sm:text-lg text-slate-800 leading-snug">
              {t.scanner.enableHistoryLabel}
            </span>
          </label>

          {preferences.enableHistory && (
            <div className="pl-4 sm:pl-8 space-y-1">
              <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
                <input
                  type="checkbox"
                  checked={preferences.saveMessageInHistory}
                  onChange={(e) =>
                    onUpdatePreferences({
                      saveMessageInHistory: e.target.checked,
                    })
                  }
                  className="mt-1 h-5 w-5 rounded border-slate-400 text-teal-700 focus:ring-teal-700 shrink-0"
                />
                <span className="text-base sm:text-lg text-slate-800 font-medium leading-snug">
                  {t.scanner.saveMessageTextLabel}
                </span>
              </label>
              <p className="text-sm sm:text-base text-slate-600 pl-8 leading-snug">
                {t.scanner.saveMessageTextHint}
              </p>
            </div>
          )}
        </fieldset>
      </form>

      {/* Result Panel */}
      {result && (
        <section
          ref={resultPanelRef}
          aria-live="polite"
          aria-label={t.scanner.resultHeading}
          className="space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.scanner.resultHeading}
          </h2>

          {/* Primary Classification & Plain-Language Explanation */}
          <ClassificationBanner
            classification={result.classification}
            riskLevel={result.riskLevel}
            summaryText={getSummaryForClassification(result)}
            t={t}
          />

          {/* Voice Warning Controls */}
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
            onSpeakPrimary={() => speech.speak(buildSpokenResultText(result))}
            onReplay={() => speech.replay(buildSpokenResultText(result))}
            onStop={speech.stopSpeaking}
            onTestVoice={() => speech.speak(t.voice.testSampleSpeech)}
            showSettingsControls={false}
          />

          {/* Detected Warning Signs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.scanner.warningSignsHeading}
            </h3>

            {result.warningSigns.length === 0 ? (
              <p className="mt-3 text-lg text-slate-700">
                {t.scanner.noWarningSignsText}
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-slate-200 border-t border-slate-200">
                {result.warningSigns.map((sign) => {
                  const ruleInfo = t.rules[sign.ruleId];
                  const categoryLabel = t.categories[sign.category];
                  return (
                    <li key={sign.ruleId} className="py-5 space-y-2">
                      <div className="flex items-start gap-3">
                        <ShieldAlert
                          className={`w-6 h-6 shrink-0 mt-1 ${
                            sign.severity === 'high'
                              ? 'text-red-700'
                              : 'text-amber-700'
                          }`}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-medium text-slate-600 leading-snug">
                            {categoryLabel}
                          </p>
                          <h4 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-snug">
                            {ruleInfo.title}
                          </h4>
                        </div>
                      </div>
                      <div className="sm:pl-9 space-y-2">
                        <p className="text-lg text-slate-700 leading-relaxed">
                          {ruleInfo.detail}
                        </p>
                        {sign.matchedPhrases.length > 0 && (
                          <p className="text-base text-slate-700 break-words">
                            <span className="font-semibold text-slate-900">
                              {t.scanner.triggeredPhrasesLabel}:{' '}
                            </span>
                            <span className="font-mono text-sm sm:text-base text-slate-800 break-all sm:break-words">
                              {sign.matchedPhrases
                                .map((p) => `“${p}”`)
                                .join(' · ')}
                            </span>
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Recommended Next Steps */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.scanner.nextStepsHeading}
            </h3>
            <ol className="mt-4 space-y-3.5">
              {getNextSteps(result).map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-lg sm:text-xl text-slate-800 leading-relaxed"
                >
                  <CheckCircle2
                    className="w-6 h-6 text-teal-700 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-5 border-t border-slate-200 text-lg font-semibold text-slate-900">
              {t.scanner.cautionBanner}
            </div>
          </div>

          {/* Heuristic Disclaimer */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-4 sm:p-5 flex items-start gap-3 text-base sm:text-lg text-slate-700">
            <Info className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="min-w-0">{t.scanner.heuristicDisclaimer}</p>
          </div>
        </section>
      )}
    </div>
  );
};

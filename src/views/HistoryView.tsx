import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/types';
import {
  NavSection,
  ScamClassification,
  ScanHistoryRecord,
  UserPreferences,
} from '../types';

interface HistoryViewProps {
  t: TranslationDictionary;
  history: ScanHistoryRecord[];
  storageAvailable: boolean;
  preferences: UserPreferences;
  onUpdatePreferences: (partial: Partial<UserPreferences>) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (section: NavSection) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  t,
  history,
  storageAvailable,
  preferences,
  onUpdatePreferences,
  onDeleteRecord,
  onClearAll,
  onNavigate,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderClassification = (cls: ScamClassification) => {
    if (cls === 'LIKELY_SCAM') {
      return (
        <span className="inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-red-900">
          <ShieldAlert className="w-6 h-6 text-red-700 shrink-0" aria-hidden="true" />
          <span>{t.classifications.LIKELY_SCAM}</span>
        </span>
      );
    }
    if (cls === 'SUSPICIOUS') {
      return (
        <span className="inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-amber-950">
          <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" aria-hidden="true" />
          <span>{t.classifications.SUSPICIOUS}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-teal-950">
        <ShieldCheck className="w-6 h-6 text-teal-700 shrink-0" aria-hidden="true" />
        <span>{t.classifications.NO_OBVIOUS_SCAM}</span>
      </span>
    );
  };

  const getLanguageDisplayName = (code: string): string => {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    return found ? found.nativeName : code;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {t.history.title}
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
            {t.history.subtitle}
          </p>
        </div>

        {history.length > 0 && !confirmingClearAll && (
          <button
            type="button"
            onClick={() => setConfirmingClearAll(true)}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl border border-red-300 bg-white text-red-800 font-semibold text-base hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-red-700 shrink-0"
          >
            <Trash2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t.history.clearAllBtn}</span>
          </button>
        )}
      </div>

      {/* Inline Accessible Clear-All Confirmation */}
      {confirmingClearAll && (
        <div
          role="alertdialog"
          aria-labelledby="clear-history-confirm-heading"
          className="rounded-2xl border border-red-300 bg-red-50 p-6 space-y-4"
        >
          <p
            id="clear-history-confirm-heading"
            className="text-lg sm:text-xl font-bold text-red-950"
          >
            {t.history.confirmClearQuestion}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClearAll();
                setConfirmingClearAll(false);
              }}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-red-700 text-white font-semibold text-base hover:bg-red-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-red-700 focus-visible:ring-offset-2"
            >
              {t.history.confirmClearYes}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingClearAll(false)}
              className="min-h-[48px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
            >
              {t.history.confirmClearCancel}
            </button>
          </div>
        </div>
      )}

      {/* Storage Unavailable Warning */}
      {!storageAvailable && (
        <div
          role="status"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-lg text-amber-950"
        >
          {t.history.storageUnavailableWarning}
        </div>
      )}

      {/* Privacy Notice & Preferences */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-5">
        <div className="flex items-start gap-3.5">
          <Lock className="w-6 h-6 text-teal-800 shrink-0 mt-1" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.history.privacyBannerTitle}
            </h2>
            <p className="mt-1.5 text-lg text-slate-700 leading-relaxed">
              {t.history.privacyBannerBody}
            </p>
          </div>
        </div>

        <div className="pt-5 border-t border-slate-200 space-y-3">
          <label className="flex items-start gap-3.5 cursor-pointer min-h-[44px] py-1">
            <input
              type="checkbox"
              checked={preferences.enableHistory}
              onChange={(e) =>
                onUpdatePreferences({ enableHistory: e.target.checked })
              }
              className="mt-1 h-5 w-5 rounded border-slate-400 text-teal-700 focus:ring-teal-700 shrink-0"
            />
            <span className="text-lg text-slate-800 font-medium">
              {t.scanner.enableHistoryLabel}
            </span>
          </label>

          {preferences.enableHistory && (
            <div className="pl-8 space-y-1">
              <label className="flex items-start gap-3.5 cursor-pointer min-h-[44px] py-1">
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
                <span className="text-lg text-slate-800">
                  {t.scanner.saveMessageTextLabel}
                </span>
              </label>
              <p className="text-base text-slate-600 pl-8">
                {t.scanner.saveMessageTextHint}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Records List or Empty State */}
      {history.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t.history.emptyTitle}
          </h2>
          <p className="text-lg text-slate-700 max-w-lg mx-auto">
            {t.history.emptyBody}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold text-lg hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
            >
              <span>{t.nav.scanner}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {history.map((rec) => {
            const isExpanded = Boolean(expandedIds[rec.id]);
            const formattedTime = new Date(rec.timestamp).toLocaleString(
              t.meta.bcp47,
              {
                dateStyle: 'medium',
                timeStyle: 'short',
              }
            );

            return (
              <article
                key={rec.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    {renderClassification(rec.classification)}
                    <div className="text-base text-slate-600 tabular-nums flex flex-wrap items-center gap-2">
                      <span>{formattedTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.riskLevels[rec.riskLevel]}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t.history.languageUsedLabel}:{' '}
                        {getLanguageDisplayName(rec.language)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(rec.id)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
                    >
                      <span>
                        {isExpanded
                          ? t.history.hideDetailsBtn
                          : t.history.viewDetailsBtn}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5" aria-hidden="true" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteRecord(rec.id)}
                      aria-label={t.history.deleteRecordBtn}
                      className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-red-800 font-semibold text-base hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-red-700"
                    >
                      <Trash2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                      <span>{t.history.deleteRecordBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Summary of Categories Triggered */}
                {rec.categoriesTriggered.length > 0 && (
                  <p className="text-base text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {t.scanner.warningSignsHeading}:{' '}
                    </span>
                    {rec.categoriesTriggered
                      .map((cat) => t.categories[cat] ?? cat)
                      .join(' · ')}
                  </p>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    {rec.ruleIdsTriggered.length > 0 && (
                      <ul className="space-y-2 text-base sm:text-lg text-slate-800 list-disc pl-6">
                        {rec.ruleIdsTriggered.map((ruleId) => {
                          const rule = t.rules[ruleId];
                          if (!rule) return null;
                          return (
                            <li key={ruleId}>
                              <span className="font-semibold">{rule.title}:</span>{' '}
                              {rule.detail}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">
                        {t.history.savedMessageLabel}
                      </h3>
                      {rec.messageSaved && rec.originalMessage ? (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-lg text-slate-900 whitespace-pre-wrap break-words">
                          {rec.originalMessage}
                        </p>
                      ) : (
                        <p className="text-base text-slate-600 italic">
                          {t.history.messageNotSavedNote}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

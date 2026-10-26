import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { TranslationDictionary } from '../i18n/types';
import {
  NavSection,
  ScamClassification,
  ScanHistoryRecord,
} from '../types';

interface HomeViewProps {
  t: TranslationDictionary;
  recentHistory: ScanHistoryRecord[];
  onNavigate: (section: NavSection) => void;
  onQuickScan: (messageText: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  t,
  recentHistory,
  onNavigate,
  onQuickScan,
}) => {
  const [previewText, setPreviewText] = useState('');

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickScan(previewText);
  };

  const classificationIcon = (cls: ScamClassification) => {
    if (cls === 'LIKELY_SCAM') {
      return <ShieldAlert className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" />;
    }
    if (cls === 'SUSPICIOUS') {
      return <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />;
    }
    return <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />;
  };

  return (
    <div className="space-y-7 sm:space-y-10">
      {/* Hero & Quick Scan Preview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10">
        <p className="text-base sm:text-lg font-semibold text-teal-800">
          {t.brand.tagline}
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-slate-900 max-w-2xl">
          {t.home.welcomeTitle}
        </h1>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
          {t.home.welcomeBody}
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => onNavigate('scanner')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[52px] px-5 sm:px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold text-lg text-center hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <ShieldCheck className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{t.home.primaryCta}</span>
            <ArrowRight className="hidden sm:inline-block w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Quick Scanning Input Preview */}
        <form
          onSubmit={handlePreviewSubmit}
          className="mt-7 pt-7 sm:mt-8 sm:pt-8 border-t border-slate-200"
        >
          <label
            htmlFor="home-quick-scan-textarea"
            className="block text-lg font-bold text-slate-900 mb-2.5"
          >
            {t.home.quickPreviewLabel}
          </label>
          <textarea
            id="home-quick-scan-textarea"
            rows={3}
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder={t.home.quickPreviewPlaceholder}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-lg text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-3 focus:ring-teal-700/20"
          />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
            <p className="text-base text-slate-600 flex items-start sm:items-center gap-2">
              <Lock className="w-4 h-4 mt-1 sm:mt-0 text-teal-800 shrink-0" aria-hidden="true" />
              <span>{t.home.privacyStatementTitle}</span>
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-lg text-center hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
            >
              <span className="leading-snug">{t.home.quickPreviewAction}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      {/* Golden Safety Reminder */}
      <section
        aria-label={t.home.safetyReminderTitle}
        className="rounded-2xl border border-amber-300 bg-amber-50/75 p-5 sm:p-7"
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2.5 sm:gap-x-4 sm:gap-y-1.5 items-start">
          <div
            className="h-11 w-11 sm:h-12 sm:w-12 sm:row-span-2 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="self-center sm:self-start text-xl font-bold text-amber-950 min-w-0">
            {t.home.safetyReminderTitle}
          </h2>
          <p className="col-span-2 sm:col-span-1 sm:col-start-2 text-lg sm:text-xl text-slate-800 font-medium leading-relaxed">
            {t.home.safetyReminderBody}
          </p>
        </div>
      </section>

      {/* Three Result Classification Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t.home.examplesHeading}
          </h2>
          <p className="mt-1 text-lg text-slate-700">
            {t.home.examplesSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-red-900 leading-snug min-w-0">
                {t.classifications.LIKELY_SCAM}
              </h3>
            </div>
            <p className="mt-3 text-lg text-slate-700 leading-relaxed flex-1">
              {t.home.exampleLikelyDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-950 leading-snug min-w-0">
                {t.classifications.SUSPICIOUS}
              </h3>
            </div>
            <p className="mt-3 text-lg text-slate-700 leading-relaxed flex-1">
              {t.home.exampleSuspiciousDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-teal-950 leading-snug min-w-0">
                {t.classifications.NO_OBVIOUS_SCAM}
              </h3>
            </div>
            <p className="mt-3 text-lg text-slate-700 leading-relaxed flex-1">
              {t.home.exampleNoObviousDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Scans (Real Local History Only — Or Friendly Empty State) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <h2 className="text-2xl font-bold text-slate-900">
            {t.home.recentScansHeading}
          </h2>
          {recentHistory.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-1.5 min-h-[44px] -ml-2.5 sm:ml-0 px-2.5 py-1.5 rounded-lg text-teal-800 font-semibold text-base sm:text-lg hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
            >
              <span>{t.home.viewAllHistory}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <div className="mt-5 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
            <div className="max-w-xl">
              <h3 className="text-xl font-semibold text-slate-900">
                {t.home.emptyRecentTitle}
              </h3>
              <p className="mt-1.5 text-lg text-slate-700">
                {t.home.emptyRecentBody}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('scanner')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-lg text-center hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors shrink-0"
            >
              <span className="leading-snug">{t.nav.scanner}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-slate-200 border-t border-slate-200">
            {recentHistory.slice(0, 3).map((rec) => {
              const formattedDate = new Date(rec.timestamp).toLocaleString(
                t.meta.bcp47,
                {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }
              );
              return (
                <li key={rec.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0">
                        {classificationIcon(rec.classification)}
                      </span>
                      <span className="text-lg font-bold text-slate-900 leading-snug">
                        {t.classifications[rec.classification]}
                      </span>
                    </div>
                    <div className="mt-1 text-base text-slate-600 tabular-nums flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{formattedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.riskLevels[rec.riskLevel]}</span>
                    </div>
                    {rec.messageSaved && rec.originalMessage && (
                      <p className="mt-1.5 text-base text-slate-700 truncate max-w-2xl">
                        {rec.originalMessage}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('history')}
                    className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-semibold text-base text-center hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 shrink-0"
                  >
                    {t.history.viewDetailsBtn}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Quick Links to Test Lab & Safety Guide */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {t.home.quickLinksHeading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          <button
            type="button"
            onClick={() => onNavigate('test-lab')}
            className="text-left rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 hover:border-teal-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 transition-colors flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3.5 sm:block">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 sm:mb-4">
                  <FlaskConical className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug min-w-0">
                  {t.home.testLabCardTitle}
                </h3>
              </div>
              <p className="mt-2.5 sm:mt-2 text-lg text-slate-700 leading-relaxed">
                {t.home.testLabCardDesc}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-teal-800 font-semibold text-lg">
              <span>{t.nav.testLab}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('safety-guide')}
            className="text-left rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 hover:border-teal-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 transition-colors flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3.5 sm:block">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 sm:mb-4">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug min-w-0">
                  {t.home.safetyGuideCardTitle}
                </h3>
              </div>
              <p className="mt-2.5 sm:mt-2 text-lg text-slate-700 leading-relaxed">
                {t.home.safetyGuideCardDesc}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-teal-800 font-semibold text-lg">
              <span>{t.nav.safetyGuide}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>

      {/* Local Privacy Statement */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2.5 sm:gap-x-4 sm:gap-y-1.5 items-start">
          <div
            className="h-11 w-11 sm:row-span-2 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="self-center sm:self-start text-xl font-bold text-slate-900 min-w-0">
            {t.home.privacyStatementTitle}
          </h2>
          <p className="col-span-2 sm:col-span-1 sm:col-start-2 text-lg text-slate-700 leading-relaxed">
            {t.home.privacyStatementBody}
          </p>
        </div>
      </section>
    </div>
  );
};

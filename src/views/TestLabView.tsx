import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FlaskConical,
  Info,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  calculateTestMetrics,
  evaluateSingleTestCase,
  evaluateTestDataset,
} from '../engine/metrics';
import { FICTIONAL_TEST_DATASET } from '../engine/testDataset';
import { TranslationDictionary } from '../i18n/types';
import {
  ScamCategory,
  ScamClassification,
  TestEvaluationItem,
} from '../types';

interface TestLabViewProps {
  t: TranslationDictionary;
  onOpenInScanner: (message: string) => void;
}

type QuickFilter = 'ALL' | 'LIKELY_SCAM' | 'SUSPICIOUS' | 'LEGITIMATE';

const ALL_CATEGORIES: Array<ScamCategory | 'legitimate_lookalike'> = [
  'bank_impersonation',
  'credential_theft',
  'upi_payment_scam',
  'suspicious_links',
  'parcel_customs_scam',
  'lottery_prize_scam',
  'fake_job_scam',
  'investment_fraud',
  'government_legal_threat',
  'remote_access_scam',
  'urgency_pressure',
  'personal_info_request',
  'legitimate_lookalike',
];

export const TestLabView: React.FC<TestLabViewProps> = ({
  t,
  onOpenInScanner,
}) => {
  // Run initial live evaluation dynamically against the real scanner
  const [resultsMap, setResultsMap] = useState<
    Record<string, TestEvaluationItem>
  >(() => {
    const initial = evaluateTestDataset(FICTIONAL_TEST_DATASET);
    const map: Record<string, TestEvaluationItem> = {};
    for (const item of initial) {
      map[item.testCase.id] = item;
    }
    return map;
  });

  const [quickFilter, setQuickFilter] = useState<QuickFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [runCounter, setRunCounter] = useState<number>(1);

  const handleRunAll = () => {
    const fresh = evaluateTestDataset(FICTIONAL_TEST_DATASET);
    const map: Record<string, TestEvaluationItem> = {};
    for (const item of fresh) {
      map[item.testCase.id] = item;
    }
    setResultsMap(map);
    setRunCounter((c) => c + 1);
  };

  const handleRunSingle = (id: string) => {
    const tc = FICTIONAL_TEST_DATASET.find((item) => item.id === id);
    if (!tc) return;
    const singleEval = evaluateSingleTestCase(tc);
    setResultsMap((prev) => ({
      ...prev,
      [id]: singleEval,
    }));
  };

  const filteredCases = useMemo(() => {
    return FICTIONAL_TEST_DATASET.filter((tc) => {
      if (quickFilter === 'LIKELY_SCAM' && tc.expectedClassification !== 'LIKELY_SCAM') {
        return false;
      }
      if (quickFilter === 'SUSPICIOUS' && tc.expectedClassification !== 'SUSPICIOUS') {
        return false;
      }
      if (quickFilter === 'LEGITIMATE' && tc.nature !== 'legitimate') {
        return false;
      }
      if (selectedCategory !== 'ALL' && tc.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [quickFilter, selectedCategory]);

  const evaluatedFilteredList = useMemo(() => {
    return filteredCases
      .map((tc) => resultsMap[tc.id])
      .filter((item): item is TestEvaluationItem => Boolean(item));
  }, [filteredCases, resultsMap]);

  const metrics = useMemo(
    () => calculateTestMetrics(evaluatedFilteredList),
    [evaluatedFilteredList]
  );

  const renderClassificationLabel = (cls: ScamClassification) => {
    if (cls === 'LIKELY_SCAM') {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-red-800">
          <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.classifications.LIKELY_SCAM}</span>
        </span>
      );
    }
    if (cls === 'SUSPICIOUS') {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.classifications.SUSPICIOUS}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-teal-800">
        <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{t.classifications.NO_OBVIOUS_SCAM}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {t.testLab.title}
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
            {t.testLab.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRunAll}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-lg hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <Play className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t.testLab.runAllBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleRunAll}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t.testLab.rerunBtn}</span>
          </button>
        </div>
      </div>

      {/* Fictional Dataset Notice */}
      <div className="rounded-2xl border border-teal-300 bg-teal-50/60 p-5 flex items-start gap-3.5 text-slate-800">
        <FlaskConical className="w-6 h-6 text-teal-800 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-base sm:text-lg font-medium leading-relaxed">
          {t.testLab.fictionalNotice}
        </p>
      </div>

      {/* Live Metrics Summary */}
      <section
        aria-label={t.testLab.metricsHeading}
        key={`metrics-run-${runCounter}`}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-900">
          {t.testLab.metricsHeading}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t.testLab.metricTotal}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {metrics.totalCases}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t.testLab.metricAccuracy}
            </p>
            <p className="mt-1 text-3xl font-bold text-teal-800 tabular-nums font-mono">
              {metrics.accuracyPercentage.toFixed(1)}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t.testLab.metricCorrect}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {metrics.correctClassifications}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t.testLab.metricIncorrect}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {metrics.incorrectClassifications}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t.testLab.metricFalsePositives}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {metrics.falsePositives}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t.testLab.metricFalseNegatives}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {metrics.falseNegatives}
            </p>
          </div>
        </div>

        {/* Metric Calculation Definitions */}
        <div className="pt-5 border-t border-slate-200 space-y-2 text-base text-slate-700">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-teal-800 shrink-0" aria-hidden="true" />
            <span>{t.testLab.definitionsHeading}</span>
          </h3>
          <ul className="space-y-1.5 pl-7 list-disc">
            <li>{t.testLab.defCorrect}</li>
            <li>{t.testLab.defFalsePositive}</li>
            <li>{t.testLab.defFalseNegative}</li>
            <li>{t.testLab.defAccuracy}</li>
          </ul>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2" role="group">
          {(
            [
              { id: 'ALL', label: t.testLab.filterAll },
              { id: 'LIKELY_SCAM', label: t.testLab.filterLikelyScam },
              { id: 'SUSPICIOUS', label: t.testLab.filterSuspicious },
              { id: 'LEGITIMATE', label: t.testLab.filterLegitimate },
            ] as Array<{ id: QuickFilter; label: string }>
          ).map((tab) => {
            const active = quickFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setQuickFilter(tab.id)}
                aria-pressed={active}
                className={`min-h-[48px] px-4 py-2 rounded-xl font-semibold text-base border transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          <label
            htmlFor="test-lab-category-select"
            className="block text-base font-semibold text-slate-800 mb-2"
          >
            {t.testLab.categoryFilterLabel}
          </label>
          <select
            id="test-lab-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:max-w-md min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-medium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
          >
            <option value="ALL">{t.testLab.allCategoriesOption}</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.categories[cat]}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Test Cases List */}
      {filteredCases.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-lg text-slate-700">
          {t.testLab.emptyFilterText}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCases.map((tc) => {
            const evalItem = resultsMap[tc.id];
            return (
              <article
                key={tc.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
              >
                {/* Clean Unboxed Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base text-slate-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {tc.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {tc.nature === 'legitimate'
                        ? t.testLab.natureLegitimate
                        : t.testLab.natureSuspicious}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-800">
                      {t.categories[tc.category]}
                    </span>
                  </div>

                  {evalItem && (
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold ${
                        evalItem.isCorrect ? 'text-teal-800' : 'text-red-800'
                      }`}
                    >
                      {evalItem.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        {evalItem.isCorrect
                          ? t.testLab.statusMatch
                          : t.testLab.statusMismatch}
                      </span>
                    </span>
                  )}
                </div>

                {/* Fictional Message Plain Text */}
                <p className="text-lg sm:text-xl text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed break-words">
                  {tc.message}
                </p>

                {/* Expected vs Actual Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-base sm:text-lg">
                  <div>
                    <span className="text-slate-600 block text-sm font-medium">
                      {t.testLab.expectedLabel}
                    </span>
                    <div className="mt-1">
                      {renderClassificationLabel(tc.expectedClassification)}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-600 block text-sm font-medium">
                      {t.testLab.actualLabel}
                    </span>
                    <div className="mt-1">
                      {evalItem ? (
                        renderClassificationLabel(
                          evalItem.actualResult.classification
                        )
                      ) : (
                        <span className="text-slate-500">
                          {t.testLab.notRunYet}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Case Explanation + Triggered Rules */}
                <p className="text-base text-slate-700">{tc.explanation}</p>

                {evalItem && evalItem.actualResult.warningSigns.length > 0 && (
                  <p className="text-sm sm:text-base text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {t.scanner.warningSignsHeading}:{' '}
                    </span>
                    {evalItem.actualResult.warningSigns
                      .map((w) => t.rules[w.ruleId].title)
                      .join(' · ')}
                  </p>
                )}

                {/* Per-Case Actions */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleRunSingle(tc.id)}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
                  >
                    <Play className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.testLab.runSingleBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenInScanner(tc.message)}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2 rounded-xl border border-teal-700 bg-teal-50/60 text-teal-900 font-semibold text-base hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
                  >
                    <span>{t.testLab.inspectInScannerBtn}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

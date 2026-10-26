import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import React from 'react';
import { TranslationDictionary } from '../i18n/types';
import { RiskLevel, ScamClassification } from '../types';

interface ClassificationBannerProps {
  classification: ScamClassification;
  riskLevel: RiskLevel;
  summaryText: string;
  t: TranslationDictionary;
}

export const ClassificationBanner: React.FC<ClassificationBannerProps> = ({
  classification,
  riskLevel,
  summaryText,
  t,
}) => {
  const styles: Record<
    ScamClassification,
    {
      container: string;
      iconBox: string;
      heading: string;
      riskText: string;
      Icon: typeof ShieldAlert;
    }
  > = {
    LIKELY_SCAM: {
      container: 'bg-red-50/80 border-red-300',
      iconBox: 'bg-red-700 text-white',
      heading: 'text-red-950',
      riskText: 'text-red-800',
      Icon: ShieldAlert,
    },
    SUSPICIOUS: {
      container: 'bg-amber-50/80 border-amber-300',
      iconBox: 'bg-amber-700 text-white',
      heading: 'text-amber-950',
      riskText: 'text-amber-900',
      Icon: AlertTriangle,
    },
    NO_OBVIOUS_SCAM: {
      container: 'bg-teal-50/70 border-teal-300',
      iconBox: 'bg-teal-700 text-white',
      heading: 'text-teal-950',
      riskText: 'text-teal-900',
      Icon: ShieldCheck,
    },
  };

  const current = styles[classification];
  const IconComponent = current.Icon;

  return (
    <div className={`rounded-2xl border p-6 sm:p-7 ${current.container}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${current.iconBox}`}
          aria-hidden="true"
        >
          <IconComponent className="w-8 h-8" />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-base font-semibold ${current.riskText}`}>
            <span>{t.scanner.riskLevelLabel}: </span>
            <span>{t.riskLevels[riskLevel]}</span>
          </div>
          <h3 className={`mt-1 text-2xl sm:text-3xl font-bold ${current.heading}`}>
            {t.classifications[classification]}
          </h3>
          <p className="mt-3 text-lg sm:text-xl text-slate-800 leading-relaxed">
            {summaryText}
          </p>
        </div>
      </div>
    </div>
  );
};

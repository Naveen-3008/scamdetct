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
    <div className={`rounded-2xl border p-5 sm:p-7 ${current.container}`}>
      <div className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-3 sm:gap-x-4 sm:gap-y-2 items-start">
        <div
          className={`h-12 w-12 sm:h-14 sm:w-14 sm:row-span-2 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${current.iconBox}`}
          aria-hidden="true"
        >
          <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="min-w-0 self-center sm:self-start">
          <div className={`text-sm sm:text-base font-semibold leading-snug ${current.riskText}`}>
            <span>{t.scanner.riskLevelLabel}: </span>
            <span>{t.riskLevels[riskLevel]}</span>
          </div>
          <h3 className={`mt-0.5 sm:mt-1 text-xl sm:text-3xl font-bold leading-snug ${current.heading}`}>
            {t.classifications[classification]}
          </h3>
        </div>
        <p className="col-span-2 sm:col-span-1 sm:col-start-2 text-lg sm:text-xl text-slate-800 leading-relaxed">
          {summaryText}
        </p>
      </div>
    </div>
  );
};

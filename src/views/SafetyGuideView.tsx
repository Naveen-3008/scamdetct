import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCircle2,
  KeyRound,
  Landmark,
  Link2,
  Package,
  PhoneOff,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import { TranslationDictionary } from '../i18n/types';

interface SafetyGuideViewProps {
  t: TranslationDictionary;
}

const TOPIC_ICONS: Record<string, typeof KeyRound> = {
  'otp-pin': KeyRound,
  'verify-bank': Landmark,
  'fake-parcel': Package,
  'fake-jobs': Briefcase,
  'investment-scams': TrendingUp,
  'links-qr': Link2,
  'remote-access': Smartphone,
  'after-mistake': PhoneOff,
};

export const SafetyGuideView: React.FC<SafetyGuideViewProps> = ({ t }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {t.safetyGuide.title}
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
          {t.safetyGuide.subtitle}
        </p>
      </div>

      {/* Prominent Urgent Financial Incident Instruction */}
      <section
        aria-label={t.safetyGuide.urgentBannerTitle}
        className="rounded-2xl border border-red-300 bg-red-50/85 p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div
            className="h-12 w-12 rounded-xl bg-red-700 text-white flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-950">
              {t.safetyGuide.urgentBannerTitle}
            </h2>
            <p className="mt-2 text-lg sm:text-xl text-slate-900 leading-relaxed">
              {t.safetyGuide.urgentBannerBody}
            </p>
          </div>
        </div>
      </section>

      {/* Practical Safety Topics Grid */}
      <div className="grid grid-cols-1 gap-6">
        {t.safetyGuide.topics.map((topic) => {
          const IconComponent = TOPIC_ICONS[topic.id] ?? KeyRound;
          return (
            <section
              key={topic.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className="h-12 w-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {topic.title}
                  </h2>
                  <p className="mt-2 text-lg text-slate-700 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>
              </div>

              <ul className="pt-4 border-t border-slate-200 space-y-3">
                {topic.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-lg text-slate-800 leading-relaxed"
                  >
                    <CheckCircle2
                      className="w-5 h-5 text-teal-700 shrink-0 mt-1.5"
                      aria-hidden="true"
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* India-Specific Official Verification & Cybercrime Guidance */}
      <section className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-teal-800 shrink-0" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-900">
            {t.safetyGuide.indiaSectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              {t.safetyGuide.indiaGeneralLabel}
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t.safetyGuide.indiaGeneralBody}
            </p>
          </div>

          <div className="space-y-2 md:border-l md:border-slate-200 md:pl-6">
            <h3 className="text-lg font-bold text-slate-900">
              {t.safetyGuide.indiaOfficialLabel}
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t.safetyGuide.indiaOfficialBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

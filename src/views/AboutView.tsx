import {
  CheckCircle2,
  Info,
  Lock,
  ShieldCheck,
  Smartphone,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { TranslationDictionary } from '../i18n/types';

interface AboutViewProps {
  t: TranslationDictionary;
}

export const AboutView: React.FC<AboutViewProps> = ({ t }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {t.about.title}
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
          {t.about.subtitle}
        </p>
      </div>

      {/* How ElderShield Works */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-teal-700 shrink-0" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-900">
            {t.about.missionHeading}
          </h2>
        </div>
        <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
          {t.about.missionBody}
        </p>
      </section>

      {/* Privacy & Security Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Lock className="w-7 h-7 text-teal-700 shrink-0" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-900">
            {t.about.privacyHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">
              {t.about.privacyStoresTitle}
            </h3>
            <ul className="space-y-3">
              {t.about.privacyStoresItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-lg text-slate-700 leading-relaxed"
                >
                  <CheckCircle2
                    className="w-5 h-5 text-teal-700 shrink-0 mt-1.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 md:border-l md:border-slate-200 md:pl-6">
            <h3 className="text-xl font-bold text-slate-900">
              {t.about.privacyNeverTitle}
            </h3>
            <ul className="space-y-3">
              {t.about.privacyNeverItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-lg text-slate-700 leading-relaxed"
                >
                  <XCircle
                    className="w-5 h-5 text-slate-700 shrink-0 mt-1.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Honest Limitations */}
      <section className="rounded-2xl border border-amber-300 bg-amber-50/70 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <Info className="w-7 h-7 text-amber-800 shrink-0" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-amber-950">
            {t.about.limitationsHeading}
          </h2>
        </div>
        <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
          {t.about.limitationsBody}
        </p>
      </section>

      {/* Offline & PWA Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-7 h-7 text-teal-700 shrink-0" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-900">
            {t.about.pwaHeading}
          </h2>
        </div>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t.about.pwaBody}
        </p>
        <div className="pt-2">
          <PWAInstallButton t={t} />
        </div>
      </section>
    </div>
  );
};

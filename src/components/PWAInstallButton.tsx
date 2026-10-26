import { Download, Smartphone, X } from 'lucide-react';
import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { TranslationDictionary } from '../i18n/types';

interface PWAInstallButtonProps {
  t: TranslationDictionary;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  t,
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const widthClass = variant === 'full' ? 'w-full justify-center' : '';

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`inline-flex items-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-teal-700 bg-teal-50 text-teal-900 font-semibold text-base hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors whitespace-nowrap shrink-0 ${widthClass}`}
      >
        <Download className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>{t.pwa.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors whitespace-nowrap shrink-0 ${widthClass}`}
        >
          <Smartphone className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{t.pwa.installIOS}</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-modal-title"
          >
            <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="ios-install-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {t.pwa.iosModalTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t.pwa.close}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-lg text-slate-700">
                <p>{t.pwa.iosStep1}</p>
                <p>{t.pwa.iosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full min-h-[48px] rounded-xl bg-teal-700 px-5 py-2.5 text-lg font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors"
              >
                {t.pwa.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

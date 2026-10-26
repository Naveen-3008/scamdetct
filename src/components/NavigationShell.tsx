import {
  BookOpen,
  Clock,
  FlaskConical,
  Globe,
  Home,
  Info,
  Menu,
  ShieldCheck,
  WifiOff,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/types';
import { LanguageCode, NavSection } from '../types';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface NavigationShellProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  children: React.ReactNode;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({
  activeSection,
  onNavigate,
  language,
  onSelectLanguage,
  t,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = useOnlineStatus();

  const navItems: Array<{
    id: NavSection;
    label: string;
    Icon: typeof Home;
  }> = [
    { id: 'home', label: t.nav.home, Icon: Home },
    { id: 'scanner', label: t.nav.scanner, Icon: ShieldCheck },
    { id: 'test-lab', label: t.nav.testLab, Icon: FlaskConical },
    { id: 'history', label: t.nav.history, Icon: Clock },
    { id: 'safety-guide', label: t.nav.safetyGuide, Icon: BookOpen },
    { id: 'language-voice', label: t.nav.languageVoice, Icon: Globe },
    { id: 'about', label: t.nav.about, Icon: Info },
  ];

  const activeItem = navItems.find((item) => item.id === activeSection) ?? navItems[0];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (section: NavSection) => {
    setMobileMenuOpen(false);
    onNavigate(section);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-5 focus:py-3 focus:rounded-xl focus:bg-slate-900 focus:text-white focus:font-semibold focus:text-lg"
      >
        {t.brand.skipToMain}
      </a>

      {/* Desktop Left Sidebar */}
      <aside
        aria-label={t.brand.name}
        className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 lg:shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen"
      >
        <div className="px-6 py-5 border-b border-slate-200">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-left rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            <BrandLogo name={t.brand.name} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavClick(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full min-h-[52px] px-4 py-3 rounded-xl flex items-center gap-3.5 text-left text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-1 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                <span className="leading-snug break-words">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-3">
          <PWAInstallButton t={t} variant="full" />
          <p className="text-sm text-slate-600 px-2">{t.pwa.onlineReady}</p>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Compact 56px on Mobile to respect 15% sticky cap, clean 3-zone header on Desktop) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Left Zone: Brand on mobile, Section Breadcrumb on desktop */}
          <div className="flex items-center min-w-0">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="lg:hidden rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
            >
              <BrandLogo name={t.brand.name} size="sm" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-base font-medium text-slate-600 truncate">
              <span className="text-slate-500">{t.brand.name}</span>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900 font-semibold truncate">
                {activeItem.label}
              </span>
            </div>
          </div>

          {/* Right Zone: Accessible Language Selector + Primary CTA / Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center">
              <label htmlFor="header-language-select" className="sr-only">
                {t.nav.changeLanguage}
              </label>
              <select
                id="header-language-select"
                value={language}
                onChange={(e) =>
                  onSelectLanguage(e.target.value as LanguageCode)
                }
                aria-label={t.nav.changeLanguage}
                className="min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-base hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                    {lang.code !== 'en' ? ` (${lang.englishName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {activeSection !== 'scanner' && (
              <button
                type="button"
                onClick={() => handleNavClick('scanner')}
                className="hidden md:inline-flex items-center justify-center min-h-[48px] px-5 py-2 rounded-xl bg-teal-700 text-white font-semibold text-base hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.scanner}
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={t.nav.openMenu}
              className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Offline Connectivity Banner */}
        {!isOnline && (
          <div
            role="status"
            aria-live="polite"
            className="bg-amber-50 border-b border-amber-300 px-4 sm:px-8 py-3 text-amber-950 flex items-center gap-3 text-base sm:text-lg font-medium"
          >
            <WifiOff className="w-5 h-5 shrink-0 text-amber-800" aria-hidden="true" />
            <span>{t.pwa.offlineBanner}</span>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t.brand.name}
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div
              className="fixed inset-0 bg-slate-900/50"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-xl flex flex-col border-l border-slate-200">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
                <BrandLogo name={t.brand.name} size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t.nav.closeMenu}
                  className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
                {navItems.map(({ id, label, Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleNavClick(id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full min-h-[52px] px-4 py-3 rounded-xl flex items-center gap-3.5 text-left text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-700 ${
                        isActive
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                      <span className="leading-snug">{label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200">
                <PWAInstallButton t={t} variant="full" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 focus:outline-none"
        >
          {children}
        </main>

        {/* Quiet Reassuring Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-6 mt-auto">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-base text-slate-600">
            <p className="font-medium text-slate-800">
              {t.brand.name} · {t.brand.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleNavClick('safety-guide')}
                className="text-teal-800 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded"
              >
                {t.nav.safetyGuide}
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className="text-teal-800 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded"
              >
                {t.nav.about}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

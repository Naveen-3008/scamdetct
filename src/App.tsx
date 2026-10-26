/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { NavigationShell } from './components/NavigationShell';
import { useSpeech } from './hooks/useSpeech';
import { getTranslation } from './i18n';
import {
  LanguageCode,
  NavSection,
  ScanHistoryRecord,
  ScanResult,
  UserPreferences,
} from './types';
import {
  checkLocalStorageAvailable,
  createHistoryRecordFromScan,
  loadScanHistory,
  loadUserPreferences,
  saveScanHistoryList,
  saveUserPreferences,
} from './utils/storage';
import { AboutView } from './views/AboutView';
import { HistoryView } from './views/HistoryView';
import { HomeView } from './views/HomeView';
import { LanguageVoiceView } from './views/LanguageVoiceView';
import { SafetyGuideView } from './views/SafetyGuideView';
import { ScannerView } from './views/ScannerView';
import { TestLabView } from './views/TestLabView';

const VALID_SECTIONS: NavSection[] = [
  'home',
  'scanner',
  'test-lab',
  'history',
  'safety-guide',
  'language-voice',
  'about',
];

function parseHashSection(): NavSection {
  if (typeof window === 'undefined') return 'home';
  const cleaned = window.location.hash.replace(/^#\/?/, '').trim();
  if (VALID_SECTIONS.includes(cleaned as NavSection)) {
    return cleaned as NavSection;
  }
  return 'home';
}

export default function App() {
  const [storageAvailable] = useState<boolean>(() =>
    checkLocalStorageAvailable()
  );
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    loadUserPreferences()
  );
  const [history, setHistory] = useState<ScanHistoryRecord[]>(() =>
    loadScanHistory()
  );
  const [activeSection, setActiveSection] = useState<NavSection>(() =>
    parseHashSection()
  );
  const [pendingScannerInput, setPendingScannerInput] = useState<{
    text: string;
    autoRun: boolean;
  }>({ text: '', autoRun: false });

  const t = getTranslation(preferences.language);

  const speech = useSpeech({
    language: preferences.language,
    rate: preferences.speechRate,
    volume: preferences.speechVolume,
  });

  // Sync <html lang="..."> and document title with selected language
  useEffect(() => {
    document.documentElement.lang = preferences.language;
    document.title = `${t.brand.name} — ${t.brand.tagline}`;
  }, [preferences.language, t.brand.name, t.brand.tagline]);

  // Listen to browser Back/Forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashSection();
      speech.stopSpeaking();
      setActiveSection(next);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [speech]);

  const navigateTo = useCallback(
    (section: NavSection) => {
      speech.stopSpeaking();
      setActiveSection(section);
      if (typeof window !== 'undefined') {
        const nextHash = `#${section}`;
        if (window.location.hash !== nextHash) {
          window.history.pushState(null, '', nextHash);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [speech]
  );

  const handleUpdatePreferences = useCallback(
    (partial: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...partial };
        saveUserPreferences(updated);
        return updated;
      });
    },
    []
  );

  const handleSelectLanguage = useCallback(
    (language: LanguageCode) => {
      handleUpdatePreferences({ language });
    },
    [handleUpdatePreferences]
  );

  const handleRecordScan = useCallback(
    (result: ScanResult, rawMessage: string) => {
      if (!preferences.enableHistory) return;
      const newRecord = createHistoryRecordFromScan(
        result,
        rawMessage,
        preferences
      );
      setHistory((prev) => {
        const next = [newRecord, ...prev].slice(0, 100);
        saveScanHistoryList(next);
        return next;
      });
    },
    [preferences]
  );

  const handleDeleteRecord = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveScanHistoryList(next);
      return next;
    });
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
    saveScanHistoryList([]);
  }, []);

  const handleQuickScanFromHome = useCallback(
    (messageText: string) => {
      setPendingScannerInput({ text: messageText, autoRun: true });
      navigateTo('scanner');
    },
    [navigateTo]
  );

  const handleOpenInScannerFromTestLab = useCallback(
    (messageText: string) => {
      setPendingScannerInput({ text: messageText, autoRun: true });
      navigateTo('scanner');
    },
    [navigateTo]
  );

  const handleConsumeInitialScannerInput = useCallback(() => {
    setPendingScannerInput({ text: '', autoRun: false });
  }, []);

  const speechBundle = {
    supportState: speech.supportState,
    matchedVoiceName: speech.matchedVoice?.name ?? null,
    isSpeaking: speech.isSpeaking,
    canReplay: speech.canReplay,
    speak: speech.speak,
    replay: speech.replay,
    stopSpeaking: speech.stopSpeaking,
  };

  return (
    <NavigationShell
      activeSection={activeSection}
      onNavigate={navigateTo}
      language={preferences.language}
      onSelectLanguage={handleSelectLanguage}
      t={t}
    >
      {activeSection === 'home' && (
        <HomeView
          t={t}
          recentHistory={history}
          onNavigate={navigateTo}
          onQuickScan={handleQuickScanFromHome}
        />
      )}

      {activeSection === 'scanner' && (
        <ScannerView
          t={t}
          initialMessage={pendingScannerInput.text}
          autoRunInitial={pendingScannerInput.autoRun}
          onConsumeInitial={handleConsumeInitialScannerInput}
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          onRecordScan={handleRecordScan}
          speech={speechBundle}
        />
      )}

      {activeSection === 'test-lab' && (
        <TestLabView
          t={t}
          onOpenInScanner={handleOpenInScannerFromTestLab}
        />
      )}

      {activeSection === 'history' && (
        <HistoryView
          t={t}
          history={history}
          storageAvailable={storageAvailable}
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAllHistory}
          onNavigate={navigateTo}
        />
      )}

      {activeSection === 'safety-guide' && <SafetyGuideView t={t} />}

      {activeSection === 'language-voice' && (
        <LanguageVoiceView
          t={t}
          preferences={preferences}
          onSelectLanguage={handleSelectLanguage}
          onUpdatePreferences={handleUpdatePreferences}
          speech={speechBundle}
        />
      )}

      {activeSection === 'about' && <AboutView t={t} />}
    </NavigationShell>
  );
}

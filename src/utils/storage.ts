import { isSupportedLanguage } from '../i18n';
import {
  RiskLevel,
  RuleId,
  ScamCategory,
  ScamClassification,
  ScanHistoryRecord,
  ScanResult,
  UserPreferences,
} from '../types';

const PREFS_STORAGE_KEY = 'eldershield_preferences_v1';
const HISTORY_STORAGE_KEY = 'eldershield_history_v1';
const MAX_HISTORY_ITEMS = 100;

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  speechRate: 0.95,
  speechVolume: 1.0,
  autoSpeakResult: true,
  saveMessageInHistory: false,
  enableHistory: true,
};

export function checkLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const probeKey = '__eldershield_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function loadUserPreferences(): UserPreferences {
  try {
    if (!checkLocalStorageAvailable()) {
      return { ...DEFAULT_PREFERENCES };
    }
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PREFERENCES };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }
    const obj = parsed as Record<string, unknown>;
    const language = isSupportedLanguage(obj.language)
      ? obj.language
      : DEFAULT_PREFERENCES.language;

    const speechRate =
      typeof obj.speechRate === 'number' &&
      Number.isFinite(obj.speechRate) &&
      obj.speechRate >= 0.5 &&
      obj.speechRate <= 1.5
        ? obj.speechRate
        : DEFAULT_PREFERENCES.speechRate;

    const speechVolume =
      typeof obj.speechVolume === 'number' &&
      Number.isFinite(obj.speechVolume) &&
      obj.speechVolume >= 0.1 &&
      obj.speechVolume <= 1.0
        ? obj.speechVolume
        : DEFAULT_PREFERENCES.speechVolume;

    const autoSpeakResult =
      typeof obj.autoSpeakResult === 'boolean'
        ? obj.autoSpeakResult
        : DEFAULT_PREFERENCES.autoSpeakResult;

    const saveMessageInHistory =
      typeof obj.saveMessageInHistory === 'boolean'
        ? obj.saveMessageInHistory
        : DEFAULT_PREFERENCES.saveMessageInHistory;

    const enableHistory =
      typeof obj.enableHistory === 'boolean'
        ? obj.enableHistory
        : DEFAULT_PREFERENCES.enableHistory;

    return {
      language,
      speechRate,
      speechVolume,
      autoSpeakResult,
      saveMessageInHistory,
      enableHistory,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    if (!checkLocalStorageAvailable()) return false;
    window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

function isValidClassification(val: unknown): val is ScamClassification {
  return (
    val === 'LIKELY_SCAM' || val === 'SUSPICIOUS' || val === 'NO_OBVIOUS_SCAM'
  );
}

function isValidRiskLevel(val: unknown): val is RiskLevel {
  return val === 'HIGH' || val === 'MEDIUM' || val === 'LOW';
}

export function loadScanHistory(): ScanHistoryRecord[] {
  try {
    if (!checkLocalStorageAvailable()) return [];
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      // Recover safely from corrupted non-array payload
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
      return [];
    }

    const validRecords: ScanHistoryRecord[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      if (
        typeof rec.id !== 'string' ||
        typeof rec.timestamp !== 'string' ||
        !isValidClassification(rec.classification) ||
        !isValidRiskLevel(rec.riskLevel) ||
        !isSupportedLanguage(rec.language)
      ) {
        continue;
      }

      const messageSaved = Boolean(rec.messageSaved);
      const originalMessage =
        messageSaved && typeof rec.originalMessage === 'string'
          ? rec.originalMessage.slice(0, 5000)
          : null;

      const categoriesTriggered = Array.isArray(rec.categoriesTriggered)
        ? (rec.categoriesTriggered.filter(
            (c): c is ScamCategory => typeof c === 'string'
          ) as ScamCategory[])
        : [];

      const ruleIdsTriggered = Array.isArray(rec.ruleIdsTriggered)
        ? (rec.ruleIdsTriggered.filter(
            (r): r is RuleId => typeof r === 'string'
          ) as RuleId[])
        : [];

      const matchedPhrases =
        messageSaved && Array.isArray(rec.matchedPhrases)
          ? rec.matchedPhrases
              .filter((p): p is string => typeof p === 'string')
              .slice(0, 8)
          : [];

      validRecords.push({
        id: rec.id,
        timestamp: rec.timestamp,
        originalMessage,
        messageSaved,
        classification: rec.classification,
        riskLevel: rec.riskLevel,
        categoriesTriggered,
        ruleIdsTriggered,
        matchedPhrases,
        language: rec.language,
      });
    }

    return validRecords.slice(0, MAX_HISTORY_ITEMS);
  } catch {
    // Safely recover if JSON is malformed
    try {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore removal error if storage blocked
    }
    return [];
  }
}

export function saveScanHistoryList(records: ScanHistoryRecord[]): boolean {
  try {
    if (!checkLocalStorageAvailable()) return false;
    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(records.slice(0, MAX_HISTORY_ITEMS))
    );
    return true;
  } catch {
    return false;
  }
}

export function createHistoryRecordFromScan(
  scan: ScanResult,
  rawMessage: string,
  prefs: UserPreferences
): ScanHistoryRecord {
  const id = `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const shouldSaveMessage = prefs.saveMessageInHistory;

  const allMatchedPhrases = shouldSaveMessage
    ? Array.from(
        new Set(scan.warningSigns.flatMap((w) => w.matchedPhrases))
      ).slice(0, 6)
    : [];

  return {
    id,
    timestamp: scan.scannedAt,
    originalMessage: shouldSaveMessage ? rawMessage.trim() : null,
    messageSaved: shouldSaveMessage,
    classification: scan.classification,
    riskLevel: scan.riskLevel,
    categoriesTriggered: scan.categoriesTriggered,
    ruleIdsTriggered: scan.warningSigns.map((w) => w.ruleId),
    matchedPhrases: allMatchedPhrases,
    language: prefs.language,
  };
}

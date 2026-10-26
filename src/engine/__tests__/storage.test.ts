import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { scanMessage } from '../scamScanner';
import {
  createHistoryRecordFromScan,
  DEFAULT_PREFERENCES,
  loadScanHistory,
  loadUserPreferences,
} from '../../utils/storage';

describe('ElderShield Local Storage & Privacy Safeguards', () => {
  it('omits original message text and matched phrases when saveMessageInHistory is false', () => {
    const sample =
      'Dear customer, reply with the 6-digit OTP 000000 to cancel Rs. 20,000 charge.';
    const scan = scanMessage(sample);

    const record = createHistoryRecordFromScan(scan, sample, {
      ...DEFAULT_PREFERENCES,
      saveMessageInHistory: false,
    });

    assert.equal(record.messageSaved, false);
    assert.equal(record.originalMessage, null);
    assert.deepEqual(record.matchedPhrases, []);
    assert.equal(record.classification, 'LIKELY_SCAM');
  });

  it('includes original message text only when user explicitly opts in', () => {
    const sample =
      'Install AnyDesk app and share your 9-digit AnyDesk code now.';
    const scan = scanMessage(sample);

    const record = createHistoryRecordFromScan(scan, sample, {
      ...DEFAULT_PREFERENCES,
      saveMessageInHistory: true,
      language: 'ta',
    });

    assert.equal(record.messageSaved, true);
    assert.equal(record.originalMessage, sample);
    assert.equal(record.language, 'ta');
  });

  it('falls back safely when window/localStorage is unavailable in Node test environment', () => {
    const prefs = loadUserPreferences();
    assert.equal(prefs.language, 'en');
    assert.equal(prefs.saveMessageInHistory, false);

    const history = loadScanHistory();
    assert.deepEqual(history, []);
  });
});

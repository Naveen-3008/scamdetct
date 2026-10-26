import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateTestMetrics,
  evaluateSingleTestCase,
  evaluateTestDataset,
} from '../metrics';
import { MAX_MESSAGE_LENGTH, scanMessage } from '../scamScanner';
import { FICTIONAL_TEST_DATASET } from '../testDataset';
import { ScamCategory, TestCase } from '../../types';

describe('ElderShield Local Heuristic Scam Scanner', () => {
  it('rejects empty or whitespace-only input cleanly', () => {
    const res1 = scanMessage('');
    assert.equal(res1.isValid, false);
    assert.equal(res1.validationError, 'EMPTY');

    const res2 = scanMessage('    \n\t  ');
    assert.equal(res2.isValid, false);
    assert.equal(res2.validationError, 'EMPTY');
  });

  it('rejects overly long input exceeding MAX_MESSAGE_LENGTH', () => {
    const huge = 'a'.repeat(MAX_MESSAGE_LENGTH + 10);
    const res = scanMessage(huge);
    assert.equal(res.isValid, false);
    assert.equal(res.validationError, 'TOO_LONG');
  });

  it('does NOT flag a single word like "bank" as a scam', () => {
    const res = scanMessage('I am walking to the bank branch tomorrow morning.');
    assert.equal(res.isValid, true);
    assert.equal(res.classification, 'NO_OBVIOUS_SCAM');
    assert.equal(res.warningSigns.length, 0);
  });

  it('does NOT flag legitimate OTP messages with protective "Do not share" advisories', () => {
    const res = scanMessage(
      '492810 is your OTP for account login. Valid for 5 mins. Do NOT share this OTP with anyone.'
    );
    assert.equal(res.classification, 'NO_OBVIOUS_SCAM');
  });

  it('flags explicit OTP theft requests as LIKELY_SCAM', () => {
    const res = scanMessage(
      'Dear customer, reply with the 6-digit OTP sent to your mobile to cancel Rs. 29,000 debit.'
    );
    assert.equal(res.classification, 'LIKELY_SCAM');
    assert.equal(res.riskLevel, 'HIGH');
    assert.ok(res.categoriesTriggered.includes('credential_theft'));
  });

  it('flags QR-code / UPI PIN "scan to receive money" tricks as LIKELY_SCAM', () => {
    const res = scanMessage(
      'Please scan this QR code and enter your UPI PIN to receive Rs. 8,500 advance.'
    );
    assert.equal(res.classification, 'LIKELY_SCAM');
    assert.ok(res.categoriesTriggered.includes('upi_payment_scam'));
  });

  it('flags AnyDesk / APK remote-access requests as LIKELY_SCAM', () => {
    const res = scanMessage(
      'Install AnyDesk app and share your 9-digit AnyDesk code with our pension support officer.'
    );
    assert.equal(res.classification, 'LIKELY_SCAM');
    assert.ok(res.categoriesTriggered.includes('remote_access_scam'));
  });

  it('flags standalone URL shorteners without overt fraud demands as SUSPICIOUS', () => {
    const res = scanMessage('Look at this event album: https://bit.ly/sample-photos');
    assert.equal(res.classification, 'SUSPICIOUS');
    assert.equal(res.riskLevel, 'MEDIUM');
    assert.ok(res.categoriesTriggered.includes('suspicious_links'));
  });

  it('covers all 12 required scam categories in the bundled 50+ fictional test dataset', () => {
    assert.ok(
      FICTIONAL_TEST_DATASET.length >= 50,
      `Expected >= 50 test cases, found ${FICTIONAL_TEST_DATASET.length}`
    );

    const allTwelveCategories: ScamCategory[] = [
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
    ];

    const datasetCategories = new Set(FICTIONAL_TEST_DATASET.map((tc) => tc.category));
    for (const cat of allTwelveCategories) {
      assert.ok(datasetCategories.has(cat), `Missing category in test dataset: ${cat}`);
    }

    const legitimateCases = FICTIONAL_TEST_DATASET.filter(
      (tc) => tc.nature === 'legitimate'
    );
    assert.ok(legitimateCases.length >= 10, 'Should include at least 10 legitimate cases');
  });

  it('evaluates the 56-case test dataset with high accuracy and zero false positives on legitimate messages', () => {
    const evaluations = evaluateTestDataset(FICTIONAL_TEST_DATASET);
    const metrics = calculateTestMetrics(evaluations);

    assert.equal(metrics.totalCases, FICTIONAL_TEST_DATASET.length);
    assert.equal(metrics.falsePositives, 0, 'Legitimate lookalike messages should not produce false positives');
    assert.ok(
      metrics.accuracyPercentage >= 90,
      `Expected >= 90% accuracy on benchmark set, got ${metrics.accuracyPercentage}%`
    );
  });
});

describe('Test Lab Metrics Calculation', () => {
  it('handles empty test datasets safely without NaN', () => {
    const metrics = calculateTestMetrics([]);
    assert.equal(metrics.totalCases, 0);
    assert.equal(metrics.correctClassifications, 0);
    assert.equal(metrics.incorrectClassifications, 0);
    assert.equal(metrics.falsePositives, 0);
    assert.equal(metrics.falseNegatives, 0);
    assert.equal(metrics.accuracyPercentage, 0);
    assert.equal(Number.isNaN(metrics.accuracyPercentage), false);
  });

  it('calculates exact false positives, false negatives, and accuracy percentage dynamically', () => {
    const customCases: TestCase[] = [
      {
        id: 'MOCK-1',
        message: 'Hi grandma, dinner is ready downstairs.',
        expectedClassification: 'NO_OBVIOUS_SCAM',
        category: 'legitimate_lookalike',
        explanation: 'Legitimate message correctly classified',
        nature: 'legitimate',
      },
      {
        id: 'MOCK-2',
        message: 'Check https://bit.ly/family-pic',
        // Suppose someone mistakenly labeled this legitimate in a synthetic test to verify FP counting:
        expectedClassification: 'NO_OBVIOUS_SCAM',
        category: 'legitimate_lookalike',
        explanation: 'Synthetic test for false positive counter',
        nature: 'legitimate',
      },
      {
        id: 'MOCK-3',
        message: 'Hello friend, please call me when free regarding yesterday.',
        // Suppose someone labeled this suspicious to verify FN counting:
        expectedClassification: 'SUSPICIOUS',
        category: 'urgency_pressure',
        explanation: 'Synthetic test for false negative counter',
        nature: 'suspicious',
      },
      {
        id: 'MOCK-4',
        message: 'Install AnyDesk and share your 9-digit AnyDesk code now.',
        expectedClassification: 'LIKELY_SCAM',
        category: 'remote_access_scam',
        explanation: 'True positive scam',
        nature: 'suspicious',
      },
    ];

    const evals = customCases.map(evaluateSingleTestCase);
    const metrics = calculateTestMetrics(evals);

    assert.equal(metrics.totalCases, 4);
    assert.equal(metrics.correctClassifications, 2); // MOCK-1 and MOCK-4
    assert.equal(metrics.incorrectClassifications, 2); // MOCK-2 and MOCK-3
    assert.equal(metrics.falsePositives, 1); // MOCK-2
    assert.equal(metrics.falseNegatives, 1); // MOCK-3
    assert.equal(metrics.accuracyPercentage, 50);
  });
});

import {
  TestCase,
  TestEvaluationItem,
  TestLabMetrics,
} from '../types';
import { scanMessage } from './scamScanner';

export function evaluateSingleTestCase(testCase: TestCase): TestEvaluationItem {
  const actualResult = scanMessage(testCase.message);
  const isCorrect = actualResult.classification === testCase.expectedClassification;

  // False Positive: A legitimate message (expected NO_OBVIOUS_SCAM) flagged as SUSPICIOUS or LIKELY_SCAM
  const isFalsePositive =
    testCase.nature === 'legitimate' &&
    actualResult.classification !== 'NO_OBVIOUS_SCAM';

  // False Negative: A suspicious/scam message missed as NO_OBVIOUS_SCAM
  const isFalseNegative =
    testCase.nature === 'suspicious' &&
    actualResult.classification === 'NO_OBVIOUS_SCAM';

  return {
    testCase,
    actualResult,
    isCorrect,
    isFalsePositive,
    isFalseNegative,
  };
}

export function evaluateTestDataset(cases: TestCase[]): TestEvaluationItem[] {
  return cases.map((tc) => evaluateSingleTestCase(tc));
}

export function calculateTestMetrics(
  evaluations: TestEvaluationItem[]
): TestLabMetrics {
  const totalCases = evaluations.length;
  if (totalCases === 0) {
    return {
      totalCases: 0,
      correctClassifications: 0,
      incorrectClassifications: 0,
      falsePositives: 0,
      falseNegatives: 0,
      accuracyPercentage: 0,
    };
  }

  let correctClassifications = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  for (const item of evaluations) {
    if (item.isCorrect) {
      correctClassifications += 1;
    }
    if (item.isFalsePositive) {
      falsePositives += 1;
    }
    if (item.isFalseNegative) {
      falseNegatives += 1;
    }
  }

  const incorrectClassifications = totalCases - correctClassifications;
  const accuracyPercentage = Number(
    ((correctClassifications / totalCases) * 100).toFixed(1)
  );

  return {
    totalCases,
    correctClassifications,
    incorrectClassifications,
    falsePositives,
    falseNegatives,
    accuracyPercentage,
  };
}

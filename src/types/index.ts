export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn' | 'bn';

export type NavSection =
  | 'home'
  | 'scanner'
  | 'test-lab'
  | 'history'
  | 'safety-guide'
  | 'language-voice'
  | 'about';

export type ScamClassification =
  | 'LIKELY_SCAM'
  | 'SUSPICIOUS'
  | 'NO_OBVIOUS_SCAM';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ScamCategory =
  | 'bank_impersonation'
  | 'credential_theft'
  | 'upi_payment_scam'
  | 'suspicious_links'
  | 'parcel_customs_scam'
  | 'lottery_prize_scam'
  | 'fake_job_scam'
  | 'investment_fraud'
  | 'government_legal_threat'
  | 'remote_access_scam'
  | 'urgency_pressure'
  | 'personal_info_request';

export type RuleId =
  | 'bank_kyc_account_threat'
  | 'bank_unverified_contact'
  | 'credential_otp_pin_request'
  | 'credential_login_harvest'
  | 'upi_qr_receive_trick'
  | 'upi_fake_credit_refund'
  | 'link_shortener_detected'
  | 'link_misleading_domain_or_apk'
  | 'parcel_held_fee_demand'
  | 'lottery_prize_claim'
  | 'job_easy_income_task'
  | 'job_unsolicited_teaser'
  | 'investment_guaranteed_returns'
  | 'gov_legal_digital_arrest'
  | 'remote_access_app_request'
  | 'urgency_high_pressure'
  | 'personal_financial_info_ask';

export interface DetectedWarningSign {
  ruleId: RuleId;
  category: ScamCategory;
  severity: 'high' | 'medium' | 'low';
  score: number;
  matchedPhrases: string[];
}

export interface ScanResult {
  isValid: boolean;
  validationError?: 'EMPTY' | 'TOO_LONG';
  normalizedLength: number;
  classification: ScamClassification;
  riskLevel: RiskLevel;
  totalScore: number;
  warningSigns: DetectedWarningSign[];
  categoriesTriggered: ScamCategory[];
  scannedAt: string;
}

export interface TestCase {
  id: string;
  message: string;
  expectedClassification: ScamClassification;
  category: ScamCategory | 'legitimate_lookalike';
  explanation: string;
  nature: 'suspicious' | 'legitimate';
}

export interface TestEvaluationItem {
  testCase: TestCase;
  actualResult: ScanResult;
  isCorrect: boolean;
  isFalsePositive: boolean;
  isFalseNegative: boolean;
}

export interface TestLabMetrics {
  totalCases: number;
  correctClassifications: number;
  incorrectClassifications: number;
  falsePositives: number;
  falseNegatives: number;
  accuracyPercentage: number;
}

export interface ScanHistoryRecord {
  id: string;
  timestamp: string;
  originalMessage: string | null;
  messageSaved: boolean;
  classification: ScamClassification;
  riskLevel: RiskLevel;
  categoriesTriggered: ScamCategory[];
  ruleIdsTriggered: RuleId[];
  matchedPhrases: string[];
  language: LanguageCode;
}

export interface UserPreferences {
  language: LanguageCode;
  speechRate: number;
  speechVolume: number;
  autoSpeakResult: boolean;
  saveMessageInHistory: boolean;
  enableHistory: boolean;
}

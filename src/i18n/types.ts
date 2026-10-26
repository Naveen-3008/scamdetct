import {
  LanguageCode,
  RiskLevel,
  RuleId,
  ScamCategory,
  ScamClassification,
} from '../types';

export interface SafetyTopicTranslation {
  id: string;
  title: string;
  summary: string;
  steps: [string, string, string];
}

export interface TranslationDictionary {
  meta: {
    code: LanguageCode;
    nativeName: string;
    englishName: string;
    bcp47: string;
  };
  brand: {
    name: string;
    tagline: string;
    skipToMain: string;
  };
  nav: {
    home: string;
    scanner: string;
    testLab: string;
    history: string;
    safetyGuide: string;
    languageVoice: string;
    about: string;
    openMenu: string;
    closeMenu: string;
    changeLanguage: string;
  };
  pwa: {
    offlineBanner: string;
    onlineReady: string;
    installApp: string;
    installIOS: string;
    iosModalTitle: string;
    iosStep1: string;
    iosStep2: string;
    close: string;
  };
  classifications: Record<ScamClassification, string>;
  riskLevels: Record<RiskLevel, string>;
  categories: Record<ScamCategory | 'legitimate_lookalike', string>;
  rules: Record<
    RuleId,
    {
      title: string;
      detail: string;
    }
  >;
  home: {
    welcomeTitle: string;
    welcomeBody: string;
    primaryCta: string;
    quickPreviewLabel: string;
    quickPreviewPlaceholder: string;
    quickPreviewAction: string;
    safetyReminderTitle: string;
    safetyReminderBody: string;
    examplesHeading: string;
    examplesSubheading: string;
    exampleLikelyDesc: string;
    exampleSuspiciousDesc: string;
    exampleNoObviousDesc: string;
    recentScansHeading: string;
    viewAllHistory: string;
    emptyRecentTitle: string;
    emptyRecentBody: string;
    quickLinksHeading: string;
    testLabCardTitle: string;
    testLabCardDesc: string;
    safetyGuideCardTitle: string;
    safetyGuideCardDesc: string;
    privacyStatementTitle: string;
    privacyStatementBody: string;
  };
  scanner: {
    title: string;
    subtitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    charCountLabel: string;
    checkBtn: string;
    clearBtn: string;
    exampleBtn: string;
    historyConsentGroupLabel: string;
    enableHistoryLabel: string;
    saveMessageTextLabel: string;
    saveMessageTextHint: string;
    errorEmpty: string;
    errorTooLong: string;
    resultHeading: string;
    riskLevelLabel: string;
    summaryLikelyScam: string;
    summarySuspicious: string;
    summaryNoObvious: string;
    warningSignsHeading: string;
    noWarningSignsText: string;
    triggeredPhrasesLabel: string;
    nextStepsHeading: string;
    stepsLikelyScam: [string, string, string, string];
    stepsSuspicious: [string, string, string];
    stepsNoObvious: [string, string, string];
    cautionBanner: string;
    heuristicDisclaimer: string;
    sampleMessages: [string, string, string];
  };
  voice: {
    sectionTitle: string;
    autoSpeakLabel: string;
    speakWarningBtn: string;
    replayBtn: string;
    stopBtn: string;
    testVoiceBtn: string;
    rateLabel: string;
    rateSlow: string;
    rateNormal: string;
    rateClear: string;
    volumeLabel: string;
    statusLabel: string;
    statusReady: string;
    statusSpeaking: string;
    statusMissingVoiceTitle: string;
    statusMissingVoiceBody: string;
    statusInstallHint: string;
    statusUnsupported: string;
    limitationNote: string;
    testSampleSpeech: string;
    spokenIntroLikely: string;
    spokenIntroSuspicious: string;
    spokenIntroNoObvious: string;
    spokenOutroSafety: string;
  };
  testLab: {
    title: string;
    subtitle: string;
    fictionalNotice: string;
    runAllBtn: string;
    rerunBtn: string;
    runSingleBtn: string;
    inspectInScannerBtn: string;
    filterAll: string;
    filterLikelyScam: string;
    filterSuspicious: string;
    filterLegitimate: string;
    categoryFilterLabel: string;
    allCategoriesOption: string;
    metricsHeading: string;
    metricTotal: string;
    metricCorrect: string;
    metricIncorrect: string;
    metricFalsePositives: string;
    metricFalseNegatives: string;
    metricAccuracy: string;
    definitionsHeading: string;
    defCorrect: string;
    defFalsePositive: string;
    defFalseNegative: string;
    defAccuracy: string;
    natureSuspicious: string;
    natureLegitimate: string;
    expectedLabel: string;
    actualLabel: string;
    statusMatch: string;
    statusMismatch: string;
    notRunYet: string;
    emptyFilterText: string;
  };
  history: {
    title: string;
    subtitle: string;
    privacyBannerTitle: string;
    privacyBannerBody: string;
    storageUnavailableWarning: string;
    clearAllBtn: string;
    confirmClearQuestion: string;
    confirmClearYes: string;
    confirmClearCancel: string;
    deleteRecordBtn: string;
    viewDetailsBtn: string;
    hideDetailsBtn: string;
    messageNotSavedNote: string;
    savedMessageLabel: string;
    languageUsedLabel: string;
    emptyTitle: string;
    emptyBody: string;
  };
  safetyGuide: {
    title: string;
    subtitle: string;
    urgentBannerTitle: string;
    urgentBannerBody: string;
    topics: SafetyTopicTranslation[];
    indiaSectionTitle: string;
    indiaGeneralLabel: string;
    indiaGeneralBody: string;
    indiaOfficialLabel: string;
    indiaOfficialBody: string;
  };
  languagePage: {
    title: string;
    subtitle: string;
    selectLanguageHeading: string;
    activeBadgeText: string;
    voiceSettingsHeading: string;
    voiceSettingsDesc: string;
  };
  about: {
    title: string;
    subtitle: string;
    missionHeading: string;
    missionBody: string;
    privacyHeading: string;
    privacyStoresTitle: string;
    privacyStoresItems: [string, string];
    privacyNeverTitle: string;
    privacyNeverItems: [string, string, string, string];
    limitationsHeading: string;
    limitationsBody: string;
    pwaHeading: string;
    pwaBody: string;
  };
}

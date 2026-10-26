import {
  DetectedWarningSign,
  RiskLevel,
  RuleId,
  ScamCategory,
  ScamClassification,
  ScanResult,
} from '../types';

export const MAX_MESSAGE_LENGTH = 5000;

interface RuleEvaluationContext {
  raw: string;
  lower: string;
  urls: string[];
  hasProtectiveOtpDisclaimer: boolean;
}

interface DetectionRule {
  ruleId: RuleId;
  category: ScamCategory;
  severity: 'high' | 'medium' | 'low';
  score: number;
  evaluate: (ctx: RuleEvaluationContext) => string[] | null;
}

function uniquePhrases(phrases: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of phrases) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(trimmed.slice(0, 80));
    }
    if (out.length >= 4) break;
  }
  return out;
}

function collectRegexMatches(text: string, patterns: RegExp[]): string[] {
  const matches: string[] = [];
  for (const regex of patterns) {
    const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
    const globalRegex = new RegExp(regex.source, flags);
    let m: RegExpExecArray | null;
    while ((m = globalRegex.exec(text)) !== null) {
      if (m[0]) {
        matches.push(m[0]);
      }
      if (matches.length >= 6) break;
    }
  }
  return uniquePhrases(matches);
}

function extractUrls(text: string): string[] {
  const urlRegex =
    /\b(?:https?:\/\/|www\.)[^\s<>()"']+|(?:\b[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(?:bit\.ly|tinyurl\.com|rb\.gy|cutt\.ly|t\.co|is\.gd|shorturl\.at|tiny\.cc|ow\.ly|apk|xyz|top|buzz|click|link|online|site|icu|work|vip|test)(?:\/[^\s<>()"']*)?)|\b(?:bit\.ly|tinyurl\.com|rb\.gy|cutt\.ly|t\.co|is\.gd|shorturl\.at|tiny\.cc)\/[a-zA-Z0-9_-]+/gi;
  return collectRegexMatches(text, [urlRegex]);
}

function detectProtectiveDisclaimer(lower: string): boolean {
  const protectivePatterns = [
    /\b(?:do\s+not|don't|never|please\s+do\s+not)\s+(?:share|disclose|reveal|forward|give)\s+(?:this\s+|your\s+)?(?:otp|pin|password|code|cvv)/i,
    /\b(?:bank|we)\s+never\s+ask(?:s)?\s+for\s+(?:your\s+)?(?:otp|pin|password|cvv)/i,
    /ओटीपी\s+किसी\s+के\s+साथ\s+साझा\s+न\s+करें/u,
    /யாருடனும்\s+பகிர\s+வேண்டாம்/u,
  ];
  return protectivePatterns.some((re) => re.test(lower));
}

const SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  'rb.gy',
  'cutt.ly',
  't.co',
  'is.gd',
  'shorturl.at',
  'tiny.cc',
  'ow.ly',
  'rebrand.ly',
  'goo.su',
];

const SUSPICIOUS_TLDS = [
  '.xyz',
  '.top',
  '.buzz',
  '.click',
  '.icu',
  '.vip',
  '.work',
  '.loan',
  '.gq',
  '.tk',
  '.ml',
  '.cf',
];

const DETECTION_RULES: DetectionRule[] = [
  // 1. Bank & financial institution impersonation
  {
    ruleId: 'bank_kyc_account_threat',
    category: 'bank_impersonation',
    severity: 'high',
    score: 55,
    evaluate: (ctx) => {
      const bankTerms = collectRegexMatches(ctx.raw, [
        /\b(?:sbi|hdfc|icici|axis\s*bank|pnb|kotak|canara|bob|bank\s+of\s+baroda|union\s+bank|indusind|yes\s*bank|rbi|reserve\s+bank|yono|net\s*banking|bank\s+account|debit\s+card|credit\s+card)\b|(?:खाता|बैंक|வங்கி|கணக்கு|బ్యాంకు|ఖాతా|ബാങ്ക്|അക്കൗണ്ട്|ಬ್ಯಾಂಕ್|ಖಾತೆ|ব্যাংক|অ্যাকাউন্ট)/iu,
      ]);
      const kycOrBlockTerms = collectRegexMatches(ctx.raw, [
        /\b(?:kyc\s+(?:expired|incomplete|pending|update|verification|suspend\w*)|pan\s+(?:card\s+)?(?:not\s+linked|kyc|update|expired|link\s+immediately)|account\s+(?:will\s+be\s+|has\s+been\s+|is\s+)?(?:blocked|suspended|frozen|deactivated|closed|hold)|card\s+(?:blocked|suspended|deactivated))\b|(?:केवाईसी|ब्लॉक|बंद|பான்|முடக்கப்படும்|బ్లాక్|నిలిపివేయ|ബ്ലോക്ക്|മരവിപ്പിക്കും|ಬ್ಲಾಕ್|ಸ್ಥಗಿತ|ব্লক|বন্ধ)/iu,
      ]);
      const actionOrChannel =
        ctx.urls.length > 0 ||
        /\b(?:click|link|update\s+now|verify\s+now|complete\s+here|download|call\s+immediately|within\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)|today)\b|(?:तुरंत|आज|உடனடியாக|இன்று|వెంటనే|ఈరోజు|ഉടൻ|ഇന്ന്|ತಕ್ಷಣ|ಇಂದು|অবিলম্বে|আজ)/iu.test(
          ctx.raw
        );

      if (bankTerms.length > 0 && kycOrBlockTerms.length > 0 && actionOrChannel) {
        return uniquePhrases([...bankTerms, ...kycOrBlockTerms, ...ctx.urls.slice(0, 1)]);
      }
      return null;
    },
  },
  {
    ruleId: 'bank_unverified_contact',
    category: 'bank_impersonation',
    severity: 'medium',
    score: 30,
    evaluate: (ctx) => {
      const bankOrCard = collectRegexMatches(ctx.raw, [
        /\b(?:bank|credit\s+card|debit\s+card|kyc|account\s+verification|reward\s+points|card\s+limit|customer\s+care\s+executive)\b/i,
      ]);
      const personalPhone = collectRegexMatches(ctx.raw, [
        /\b(?:call|contact|whatsapp|reach\s+us\s+at|helpline)\s*(?:on|at|:|-)?\s*(?:\+?91[-\s]?)?[6-9]\d{4}[-\s]?\d{5}\b/i,
        /\b(?:call|whatsapp)\s+(?:immediately\s+)?(?:\+?91[-\s]?)?9\d{4}[-\s]?\d{5}\b/i,
      ]);
      if (bankOrCard.length > 0 && personalPhone.length > 0) {
        return uniquePhrases([...bankOrCard, ...personalPhone]);
      }
      return null;
    },
  },

  // 2. OTP, PIN, password, and credential theft
  {
    ruleId: 'credential_otp_pin_request',
    category: 'credential_theft',
    severity: 'high',
    score: 70,
    evaluate: (ctx) => {
      // Avoid flagging standard protective bank OTP messages ("Do not share this OTP with anyone")
      const directAskPatterns = [
        /\b(?:share|send|reply\s+with|forward|tell|provide|confirm|submit|give\s+us|enter)\s+(?:your\s+|the\s+|this\s+)?(?:\d[-\s]?digit\s+)?(?:otp|one[-\s]?time\s+password|atm\s+pin|upi\s+pin|mpin|cvv|net\s*banking\s+password|account\s+password|verification\s+code|secret\s+pin)\b/i,
        /\b(?:otp|upi\s+pin|atm\s+pin|cvv|mpin|password)\s+(?:is\s+required\s+to\s+cancel|to\s+stop\s+deduction|to\s+reverse|for\s+kyc\s+executive|to\s+our\s+representative|on\s+whatsapp)\b/i,
        /\breply\s+with\s+(?:the\s+)?(?:6[-\s]?digit\s+|4[-\s]?digit\s+)?(?:code|otp|pin)\b/i,
        /(?:अपना\s+ओटीपी|ओटीपी\s+बताएं|ओटीपी\s+भेजें|पिन\s+शेयर)/u,
        /(?:உங்கள்\s+otp|otp\s+அனுப்பவும்|பின்\s+எண்ணை\s+பகிரவும்)/iu,
        /(?:మీ\s+otp|otp\s+పంపండి)/iu,
        /(?:നിങ്ങളുടെ\s+otp\s+അയയ്ക്കുക)/iu,
        /(?:ನಿಮ್ಮ\s+otp\s+ಕಳುಹಿಸಿ)/iu,
        /(?:আপনার\s+otp\s+পাঠান)/iu,
      ];

      const matches = collectRegexMatches(ctx.raw, directAskPatterns);
      if (matches.length > 0 && !ctx.hasProtectiveOtpDisclaimer) {
        return matches;
      }
      // Even if a message pastes a fake "do not share" line, if it explicitly asks to reply/send OTP to an agent/WhatsApp:
      const overrideAsk = collectRegexMatches(ctx.raw, [
        /\b(?:reply\s+with|send\s+us|forward\s+to|whatsapp\s+your)\s+(?:the\s+|your\s+)?(?:otp|pin|cvv|mpin)\b/i,
      ]);
      if (overrideAsk.length > 0) {
        return overrideAsk;
      }
      return null;
    },
  },
  {
    ruleId: 'credential_login_harvest',
    category: 'credential_theft',
    severity: 'high',
    score: 55,
    evaluate: (ctx) => {
      if (ctx.urls.length === 0) return null;
      const loginPrompt = collectRegexMatches(ctx.raw, [
        /\b(?:login\s+to\s+verify|re-?enter\s+(?:your\s+)?(?:password|credentials|user\s*id|mpin)|reset\s+your\s+net\s*banking\s+password\s+at|confirm\s+your\s+(?:login|internet\s+banking)\s+details|validate\s+your\s+credentials)\b/i,
      ]);
      if (loginPrompt.length > 0) {
        return uniquePhrases([...loginPrompt, ctx.urls[0]]);
      }
      return null;
    },
  },

  // 3. UPI, QR-code, payment, and money-transfer scams
  {
    ruleId: 'upi_qr_receive_trick',
    category: 'upi_payment_scam',
    severity: 'high',
    score: 70,
    evaluate: (ctx) => {
      const qrOrPinReceive = collectRegexMatches(ctx.raw, [
        /\b(?:scan\s+(?:this\s+|the\s+)?qr\s*(?:code)?\s+(?:to|and)\s+(?:receive|get|claim|accept|collect)|enter\s+(?:your\s+)?(?:upi\s+pin|mpin|pin)\s+to\s+(?:receive|get|claim|accept|credit|collect)|approve\s+(?:the\s+)?(?:upi\s+)?collect\s+request\s+to\s+(?:receive|get\s+refund|credit))\b/i,
        /\b(?:receive|claim|get)\s+(?:rs\.?|inr|₹)?\s*[\d,]+\s*(?:cashback|refund|payment|money|amount)?\s*(?:by\s+scanning\s+qr|by\s+entering\s+upi\s+pin|via\s+qr\s+scan)\b/i,
      ]);
      return qrOrPinReceive.length > 0 ? qrOrPinReceive : null;
    },
  },
  {
    ruleId: 'upi_fake_credit_refund',
    category: 'upi_payment_scam',
    severity: 'high',
    score: 52,
    evaluate: (ctx) => {
      const patterns = [
        /\b(?:sent\s+(?:rs\.?|inr|₹)?\s*[\d,]+\s+by\s+mistake|accidentally\s+(?:transferred|sent)\s+(?:money|rs\.?|inr|₹)|wrongly\s+credited\s+to\s+your\s+(?:upi|gpay|phonepe|paytm)).*?\b(?:send\s+it\s+back|return\s+(?:immediately|to)|refund\s+to\s+this\s+number)\b/is,
        /\bpay\s+(?:rs\.?|inr|₹)\s*\d{1,4}\s+(?:verification|processing|activation|registration|token)\s+(?:charge|fee|amount)\s+to\s+(?:receive|unlock|release|get)\b/i,
      ];
      const matches = collectRegexMatches(ctx.raw, patterns);
      return matches.length > 0 ? matches : null;
    },
  },

  // 4. Suspicious links, URL shorteners, and misleading domains
  {
    ruleId: 'link_shortener_detected',
    category: 'suspicious_links',
    severity: 'medium',
    score: 30,
    evaluate: (ctx) => {
      const matched = ctx.urls.filter((u) => {
        const lu = u.toLowerCase();
        return SHORTENER_DOMAINS.some(
          (d) => lu.includes(`${d}/`) || lu === d || lu.startsWith(`http://${d}`) || lu.startsWith(`https://${d}`)
        );
      });
      return matched.length > 0 ? uniquePhrases(matched) : null;
    },
  },
  {
    ruleId: 'link_misleading_domain_or_apk',
    category: 'suspicious_links',
    severity: 'high',
    score: 50,
    evaluate: (ctx) => {
      const suspiciousUrls: string[] = [];
      for (const u of ctx.urls) {
        const lu = u.toLowerCase();
        const isInsecureHttp = lu.startsWith('http://');
        const hasApk = /\.apk(?:\b|$|\?|\/)/i.test(lu);
        const hasRawIp = /https?:\/\/\d{1,3}(?:\.\d{1,3}){3}/i.test(lu);
        const hasSuspiciousTld = SUSPICIOUS_TLDS.some((tld) => lu.includes(tld));
        const hasImpersonationSlug =
          /(?:sbi|hdfc|icici|axis|kyc|pan|indiapost|customs|epfo|refund|reward|verify|electricity|bill)[-_][a-z0-9-]+/i.test(
            lu
          ) || /\.test\b/i.test(lu);

        if (hasApk || hasRawIp || hasSuspiciousTld || hasImpersonationSlug || isInsecureHttp) {
          suspiciousUrls.push(u);
        }
      }
      return suspiciousUrls.length > 0 ? uniquePhrases(suspiciousUrls) : null;
    },
  },

  // 5. Fake courier, parcel delivery, customs, and delivery-fee requests
  {
    ruleId: 'parcel_held_fee_demand',
    category: 'parcel_customs_scam',
    severity: 'high',
    score: 55,
    evaluate: (ctx) => {
      const courierTerms = collectRegexMatches(ctx.raw, [
        /\b(?:india\s*post|speed\s*post|parcel|shipment|package|courier|delhivery|bluedart|dhl|fedex|customs\s+warehouse|delivery\s+attempt|पार्सल|கூரியர்|பார்சல்)\b/i,
      ]);
      const problemOrFeeTerms = collectRegexMatches(ctx.raw, [
        /\b(?:incomplete\s+address|missing\s+(?:house\s+number|street|pincode|address)|held\s+at\s+(?:warehouse|customs|hub)|customs\s+(?:duty|clearance\s+fee|charge)|re-?delivery\s+(?:fee|charge)|pay\s+(?:rs\.?|inr|₹|\$)\s*\d+\s*(?:for\s+delivery|to\s+reschedule|customs|fee)?|update\s+(?:delivery\s+)?address\s+within)\b/i,
      ]);
      const hasLinkOrPay =
        ctx.urls.length > 0 ||
        /\b(?:pay|click|update\s+at|link|fee|charge)\b/i.test(ctx.raw);
      const explicitlyNoPayment = /\bno\s+payment\s+required\b/i.test(ctx.raw);

      if (
        courierTerms.length > 0 &&
        problemOrFeeTerms.length > 0 &&
        hasLinkOrPay &&
        !explicitlyNoPayment
      ) {
        return uniquePhrases([...courierTerms, ...problemOrFeeTerms, ...ctx.urls.slice(0, 1)]);
      }
      return null;
    },
  },

  // 6. Lottery winnings, prizes, and unexpected rewards
  {
    ruleId: 'lottery_prize_claim',
    category: 'lottery_prize_scam',
    severity: 'high',
    score: 55,
    evaluate: (ctx) => {
      const prizeTerms = collectRegexMatches(ctx.raw, [
        /\b(?:congratulations!?\s+you\s+(?:have\s+)?won|lucky\s+draw\s+winner|selected\s+as\s+(?:a\s+)?winner|bumper\s+(?:prize|lottery)|kbc\s+lottery|won\s+(?:a\s+)?(?:cash\s+prize|iphone|car|gift\s+voucher|jackpot)|unclaimed\s+reward\s+of\s+(?:rs\.?|inr|₹|\$)|लॉटरी|इनाम\s+जीता|பரிசு\s+வென்றுள்ளீர்கள்|லாட்டரி|లాటరీ|ലോട്ടറി|ಲಾಟರಿ|লটারি)\b/i,
      ]);
      const claimPrompt = collectRegexMatches(ctx.raw, [
        /\b(?:claim\s+(?:now|your\s+prize|reward|bonus)|processing\s+fee|tax\s+clearance|contact\s+whatsapp|click\s+below|register\s+bank\s+details|spin\s+the\s+wheel)\b/i,
      ]);
      if (prizeTerms.length > 0 && (claimPrompt.length > 0 || ctx.urls.length > 0)) {
        return uniquePhrases([...prizeTerms, ...claimPrompt, ...ctx.urls.slice(0, 1)]);
      }
      if (prizeTerms.length > 0) {
        return prizeTerms;
      }
      return null;
    },
  },

  // 7. Fake jobs, recruitment fees, and work-from-home schemes
  {
    ruleId: 'job_easy_income_task',
    category: 'fake_job_scam',
    severity: 'high',
    score: 55,
    evaluate: (ctx) => {
      const jobScamPatterns = [
        /\b(?:earn\s+(?:rs\.?|inr|₹|\$)\s*[\d,]+\s*(?:to\s*[\d,]+\s*)?(?:per\s+day|daily|per\s+hour|weekly)\s*(?:from\s+home|using\s+mobile|working\s+\d+\s*hr)?)\b/i,
        /\b(?:like\s+(?:youtube\s+)?videos|rate\s+(?:google\s+maps|hotels|products)|telegram\s+prepaid\s+task|paid\s+review\s+tasks?)\b.*?\b(?:earn|paid|salary|commission|bonus|rs\.?|₹)\b/is,
        /\b(?:job\s+offer|selected\s+for\s+(?:interview|appointment)|work\s+from\s+home\s+vacancy)\b.*?\b(?:registration\s+fee|refundable\s+security\s+deposit|laptop\s+courier\s+charge|training\s+fee|document\s+verification\s+fee)\b/is,
      ];
      const matches = collectRegexMatches(ctx.raw, jobScamPatterns);
      return matches.length > 0 ? matches : null;
    },
  },
  {
    ruleId: 'job_unsolicited_teaser',
    category: 'fake_job_scam',
    severity: 'medium',
    score: 28,
    evaluate: (ctx) => {
      const teaser = collectRegexMatches(ctx.raw, [
        /\b(?:part[-\s]?time\s+(?:online\s+)?(?:work|job|income)\s+from\s+home|hr\s+recruiter\s+from\s+[a-z]+\s+global|looking\s+for\s+flexible\s+home[-\s]?based\s+income)\b.*?\b(?:reply\s+yes|message\s+on\s+telegram|join\s+whatsapp|no\s+experience\s+needed)\b/is,
      ]);
      return teaser.length > 0 ? teaser : null;
    },
  },

  // 8. Investment fraud and guaranteed returns
  {
    ruleId: 'investment_guaranteed_returns',
    category: 'investment_fraud',
    severity: 'high',
    score: 60,
    evaluate: (ctx) => {
      const investPatterns = [
        /\b(?:guaranteed\s+(?:profit|returns?|daily\s+income|payout)|100%\s+(?:safe|assured|risk[-\s]?free)\s+(?:profit|returns?|trading)|double\s+your\s+(?:money|capital|investment)\s+in\s+\d+\s*(?:days?|weeks?|hours?))\b/i,
        /\b(?:vip\s+(?:stock|trading|institutional|crypto)\s+(?:whatsapp|telegram|group|signals)|assured\s+(?:upper\s+circuit|ipo\s+allotment)|insider\s+block\s+deal\s+tips|200%\s+return)\b/i,
      ];
      const matches = collectRegexMatches(ctx.raw, investPatterns);
      return matches.length > 0 ? matches : null;
    },
  },

  // 9. Government, police, tax, and legal-threat impersonation
  {
    ruleId: 'gov_legal_digital_arrest',
    category: 'government_legal_threat',
    severity: 'high',
    score: 62,
    evaluate: (ctx) => {
      const authorityTerms = collectRegexMatches(ctx.raw, [
        /\b(?:cbi|cyber\s+crime\s+(?:police|branch|cell)|enforcement\s+directorate|narcotics\s+bureau|supreme\s+court\s+warrant|trai\s+notice|telecom\s+department|income\s+tax\s+department|customs\s+officer|electricity\s+(?:board|power\s+supply|department)|डिजिटल\s+अरेस्ट|पुलिस|சைபர்\s+கிரைம்|மின்சார\s+இணைப்பு)\b/i,
      ]);
      const threatTerms = collectRegexMatches(ctx.raw, [
        /\b(?:digital\s+arrest|arrest\s+warrant|non[-\s]?bailable\s+warrant|illegal\s+parcel\s+in\s+your\s+aadhaar|all\s+your\s+mobile\s+numbers\s+will\s+be\s+disconnected|sim\s+card\s+blocked\s+in\s+2\s+hours|electricity\s+(?:power\s+)?will\s+be\s+disconnected\s+tonight|money\s+laundering\s+case|press\s+9\s+to\s+speak|pay\s+penalty\s+immediately|tax\s+refund\s+approved.*?click)\b/is,
      ]);

      // Distinguish legitimate utility bill notice ("pay only via your usual official electricity board portal")
      const advisesOfficialPortal =
        /\b(?:only\s+via\s+your\s+usual\s+official|visit\s+official\s+government\s+portal)\b/i.test(
          ctx.raw
        );
      if (authorityTerms.length > 0 && threatTerms.length > 0 && !advisesOfficialPortal) {
        return uniquePhrases([...authorityTerms, ...threatTerms]);
      }
      return null;
    },
  },

  // 10. Remote-access applications and suspicious app-installation requests
  {
    ruleId: 'remote_access_app_request',
    category: 'remote_access_scam',
    severity: 'high',
    score: 75,
    evaluate: (ctx) => {
      const remoteAppTerms = collectRegexMatches(ctx.raw, [
        /\b(?:anydesk|teamviewer|quicksupport|rustdesk|ammyy\s+admin|aeroadmin|airmirror|ultraviewer|isl\s+light)\b/i,
        /\b(?:install|download|open)\s+(?:our\s+|the\s+|this\s+)?(?:support\s+apk|kyc\s+apk|bank\s+apk|electricity\s+apk|customer\s+support\s+app|screen[-\s]?sharing\s+app)\b/i,
        /\b[a-z0-9_-]+\.apk\b/i,
        /\bshare\s+(?:your\s+)?(?:9[-\s]?digit\s+)?(?:anydesk|remote\s+desk|screen\s+access)\s+(?:code|id|number)\b/i,
      ]);
      return remoteAppTerms.length > 0 ? remoteAppTerms : null;
    },
  },

  // 11. Urgent threats, account suspension, and pressure tactics
  {
    ruleId: 'urgency_high_pressure',
    category: 'urgency_pressure',
    severity: 'medium',
    score: 25,
    evaluate: (ctx) => {
      const urgencyTerms = collectRegexMatches(ctx.raw, [
        /\b(?:urgent\s*[:!-]|final\s+(?:notice|warning|reminder)|within\s+(?:10|15|20|30|60|\d)\s*(?:minutes?|mins?)|within\s+(?:1|2|24)\s*hours?|tonight\s+at\s+\d{1,2}(?::\d{2})?\s*(?:pm|am)?|act\s+immediately\s+or|immediate\s+suspension|failure\s+to\s+comply\s+will\s+result|तुरंत|உடனடியாக|తక్షణమే|ഉടൻ|ತಕ್ಷಣ|অবিলম্বে)\b/i,
      ]);
      const pressureConsequence = collectRegexMatches(ctx.raw, [
        /\b(?:permanently\s+(?:blocked|closed|suspended|disconnected)|legal\s+action|account\s+freeze|penalty\s+charge|lose\s+access|forfeited|cancelled\s+immediately)\b/i,
      ]);
      if (urgencyTerms.length > 0 && pressureConsequence.length > 0) {
        return uniquePhrases([...urgencyTerms, ...pressureConsequence]);
      }
      if (
        urgencyTerms.length > 0 &&
        (ctx.urls.length > 0 || /\b(?:call|reply|verify|update|pay)\b/i.test(ctx.raw))
      ) {
        return urgencyTerms;
      }
      return null;
    },
  },

  // 12. Requests to share personal or financial information
  {
    ruleId: 'personal_financial_info_ask',
    category: 'personal_info_request',
    severity: 'medium',
    score: 36,
    evaluate: (ctx) => {
      const requestVerbs = collectRegexMatches(ctx.raw, [
        /\b(?:send|reply\s+with|share|whatsapp|email\s+us|upload|submit|confirm|provide)\b/i,
      ]);
      const piiTerms = collectRegexMatches(ctx.raw, [
        /\b(?:aadhaar\s+(?:card\s+)?(?:number|copy|photo)|pan\s+card\s+(?:number|copy|photo)|16[-\s]?digit\s+card\s+number|card\s+expiry\s+date|mother'?s\s+maiden\s+name|full\s+bank\s+account\s+number\s+and\s+ifsc|passport\s+copy|date\s+of\s+birth\s+and\s+pan)\b/i,
      ]);
      if (requestVerbs.length > 0 && piiTerms.length > 0) {
        return uniquePhrases([...requestVerbs, ...piiTerms]);
      }
      return null;
    },
  },
];

export function scanMessage(input: string): ScanResult {
  const scannedAt = new Date().toISOString();
  const trimmed = typeof input === 'string' ? input.trim() : '';

  if (trimmed.length === 0) {
    return {
      isValid: false,
      validationError: 'EMPTY',
      normalizedLength: 0,
      classification: 'NO_OBVIOUS_SCAM',
      riskLevel: 'LOW',
      totalScore: 0,
      warningSigns: [],
      categoriesTriggered: [],
      scannedAt,
    };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      validationError: 'TOO_LONG',
      normalizedLength: trimmed.length,
      classification: 'NO_OBVIOUS_SCAM',
      riskLevel: 'LOW',
      totalScore: 0,
      warningSigns: [],
      categoriesTriggered: [],
      scannedAt,
    };
  }

  const normalized = trimmed.replace(/\s+/g, ' ');
  const urls = extractUrls(normalized);
  const lower = normalized.toLowerCase();
  const hasProtectiveOtpDisclaimer = detectProtectiveDisclaimer(lower);

  const ctx: RuleEvaluationContext = {
    raw: normalized,
    lower,
    urls,
    hasProtectiveOtpDisclaimer,
  };

  const warningSigns: DetectedWarningSign[] = [];
  for (const rule of DETECTION_RULES) {
    const matchedPhrases = rule.evaluate(ctx);
    if (matchedPhrases && matchedPhrases.length > 0) {
      warningSigns.push({
        ruleId: rule.ruleId,
        category: rule.category,
        severity: rule.severity,
        score: rule.score,
        matchedPhrases,
      });
    }
  }

  // Sort warning signs by highest score first
  warningSigns.sort((a, b) => b.score - a.score);

  const rawScore = warningSigns.reduce((sum, item) => sum + item.score, 0);
  const totalScore = Math.min(100, rawScore);

  const categoriesTriggered = Array.from(
    new Set(warningSigns.map((w) => w.category))
  );

  let classification: ScamClassification = 'NO_OBVIOUS_SCAM';
  let riskLevel: RiskLevel = 'LOW';

  if (totalScore >= 50) {
    classification = 'LIKELY_SCAM';
    riskLevel = 'HIGH';
  } else if (totalScore >= 20) {
    classification = 'SUSPICIOUS';
    riskLevel = 'MEDIUM';
  } else {
    classification = 'NO_OBVIOUS_SCAM';
    riskLevel = 'LOW';
  }

  return {
    isValid: true,
    normalizedLength: normalized.length,
    classification,
    riskLevel,
    totalScore,
    warningSigns,
    categoriesTriggered,
    scannedAt,
  };
}

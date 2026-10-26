import { TestCase } from '../types';

/**
 * 56 Fictional Test Messages for ElderShield Scam Test Lab.
 * All names, account numbers (XX0000), phone numbers (90000-00000), OTPs (000000),
 * and domains (.test / fictional slugs) are 100% synthetic for safe offline testing.
 */
export const FICTIONAL_TEST_DATASET: TestCase[] = [
  // --- Category 1: Bank & Financial Institution Impersonation ---
  {
    id: 'TC-001',
    message:
      'Dear SBI Customer, your YONO account will be suspended today as your PAN card is not linked. Update KYC immediately at https://sbi-kyc-verify.test/login',
    expectedClassification: 'LIKELY_SCAM',
    category: 'bank_impersonation',
    explanation:
      'Fictional bank impersonation combining fake PAN/KYC suspension threat with a misleading external link.',
    nature: 'suspicious',
  },
  {
    id: 'TC-002',
    message:
      'ALERT: Your HDFC Bank debit card ending XX0041 has been blocked due to incomplete KYC verification. Click http://hdfc-pan-update.xyz within 2 hours to restore access.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'bank_impersonation',
    explanation:
      'Combines card-block panic, tight 2-hour deadline, and an insecure non-bank domain.',
    nature: 'suspicious',
  },
  {
    id: 'TC-003',
    message:
      'ICICI Alert: Your savings account is placed on hold. Complete urgent KYC verification now via https://bit.ly/fictional-kyc01 or lose banking access.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'bank_impersonation',
    explanation:
      'Uses bank name, account freeze threat, and a shortened link hiding the destination.',
    nature: 'suspicious',
  },
  {
    id: 'TC-004',
    message:
      'Dear customer, regarding your credit card reward points redemption and account verification, please call our customer care executive on 98765-00001.',
    expectedClassification: 'SUSPICIOUS',
    category: 'bank_impersonation',
    explanation:
      'Directs the recipient to call an unverified 10-digit mobile number for card/account verification.',
    nature: 'suspicious',
  },

  // --- Category 2: OTP, PIN, Password, and Credential Theft ---
  {
    id: 'TC-005',
    message:
      'Bank Security Desk: A transaction of Rs. 48,500 is pending on your card. Reply with the 6-digit OTP sent to your phone immediately to cancel this deduction.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'credential_theft',
    explanation:
      'Classic OTP theft pretending an OTP is needed to cancel a fraudulent charge.',
    nature: 'suspicious',
  },
  {
    id: 'TC-006',
    message:
      'Hello uncle, I am speaking from your pension branch. Please share your ATM PIN and CVV so we can renew your senior citizen life certificate online.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'credential_theft',
    explanation:
      'Directly requests secret ATM PIN and card CVV under the pretext of pension renewal.',
    nature: 'suspicious',
  },
  {
    id: 'TC-007',
    message:
      'Unusual sign-in noticed on your account. Please re-enter your netbanking password and user ID at https://bank-verify-session.test to keep your account active.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'credential_theft',
    explanation:
      'Credential harvesting link asking the user to re-enter internet banking login credentials.',
    nature: 'suspicious',
  },
  {
    id: 'TC-008',
    message:
      'नमस्ते, आपके बैंक खाते को चालू रखने के लिए कृपया अपना ओटीपी तुरंत इस नंबर पर भेजें।',
    expectedClassification: 'LIKELY_SCAM',
    category: 'credential_theft',
    explanation:
      'Hindi message asking the recipient to send their OTP immediately to keep their bank account active.',
    nature: 'suspicious',
  },

  // --- Category 3: UPI, QR-Code, Payment, and Money-Transfer Scams ---
  {
    id: 'TC-009',
    message:
      'Buyer for your old dining table here: I am sending Rs. 12,000 advance. Please scan this QR code and enter your UPI PIN to receive the amount in your bank.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'upi_payment_scam',
    explanation:
      'QR/UPI scam: scanning a QR code and entering a UPI PIN always sends money out, never receives money.',
    nature: 'suspicious',
  },
  {
    id: 'TC-010',
    message:
      'Electricity Cashback: Approve the UPI collect request of Rs. 4,999 and enter your MPIN to receive instant senior subsidy credit in your account.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'upi_payment_scam',
    explanation:
      'Deceptive UPI collect request claiming entering an MPIN will credit subsidy money.',
    nature: 'suspicious',
  },
  {
    id: 'TC-011',
    message:
      'Sir I accidentally transferred Rs. 5,000 to your PhonePe number by mistake for my mother hospital bill. Please send it back urgently to 9000011111.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'upi_payment_scam',
    explanation:
      'Fake accidental-transfer refund pressure scam using emotional urgency before the victim checks actual bank balance.',
    nature: 'suspicious',
  },
  {
    id: 'TC-012',
    message:
      'Pension arrears of Rs. 36,400 ready for release. Pay Rs. 499 verification fee via UPI to unlock immediate settlement today.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'upi_payment_scam',
    explanation:
      'Advance-fee UPI scam demanding a small payment to unlock a larger promised payout.',
    nature: 'suspicious',
  },

  // --- Category 4: Suspicious Links, URL Shorteners, and Misleading Domains ---
  {
    id: 'TC-013',
    message:
      'Check out these community garden photos from Sunday morning: https://bit.ly/garden-club-sample',
    expectedClassification: 'SUSPICIOUS',
    category: 'suspicious_links',
    explanation:
      'Contains a shortened URL hiding the destination domain, though no urgent threat or financial demand is present.',
    nature: 'suspicious',
  },
  {
    id: 'TC-014',
    message:
      'Important document shared with you. Open http://198.51.100.42/statement-login to view your monthly statement.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'suspicious_links',
    explanation:
      'Uses an unencrypted raw IP address URL masquerading as a statement login page.',
    nature: 'suspicious',
  },
  {
    id: 'TC-015',
    message:
      'Download your updated health card voucher from https://epfo-claim-portal.top/voucher before midnight.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'suspicious_links',
    explanation:
      'Imitates a government/provident-fund slug on an untrusted .top top-level domain.',
    nature: 'suspicious',
  },
  {
    id: 'TC-016',
    message:
      'Here is the link our neighbour forwarded about health tips: https://tinyurl.com/fictional-health-note',
    expectedClassification: 'SUSPICIOUS',
    category: 'suspicious_links',
    explanation:
      'Shortened URL conceals the true website address; warrants caution before clicking.',
    nature: 'suspicious',
  },

  // --- Category 5: Fake Courier, Parcel Delivery, Customs, and Delivery-Fee Requests ---
  {
    id: 'TC-017',
    message:
      'India Post Notice: Your parcel #IP0049281 is held at the sorting hub due to missing house number. Update address and pay Rs. 25 re-delivery fee at https://indiapost-track.xyz',
    expectedClassification: 'LIKELY_SCAM',
    category: 'parcel_customs_scam',
    explanation:
      'Impersonates India Post demanding a small re-delivery fee on a fake domain to harvest card details.',
    nature: 'suspicious',
  },
  {
    id: 'TC-018',
    message:
      'DHL Express: International package from London is detained by customs. Pay Rs. 2,850 customs clearance fee within 24 hours at https://parcel-customs.test',
    expectedClassification: 'LIKELY_SCAM',
    category: 'parcel_customs_scam',
    explanation:
      'Fake international customs detention notice demanding urgent payment via link.',
    nature: 'suspicious',
  },
  {
    id: 'TC-019',
    message:
      'Courier Alert: Delivery attempt failed due to incomplete address. Click https://rb.gy/mockparcel01 to confirm pincode and pay Rs. 19 handling charge.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'parcel_customs_scam',
    explanation:
      'Combines failed-delivery pretext, handling charge demand, and a URL shortener.',
    nature: 'suspicious',
  },

  // --- Category 6: Lottery Winnings, Prizes, and Unexpected Rewards ---
  {
    id: 'TC-020',
    message:
      'Congratulations! Your mobile number has won Rs. 25,00,000 in the KBC Bumper Lottery Draw! Contact WhatsApp +91-90000-00099 and pay processing fee to claim your prize.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'lottery_prize_scam',
    explanation:
      'Unsolicited lottery jackpot claim asking to contact a WhatsApp number and pay a processing fee.',
    nature: 'suspicious',
  },
  {
    id: 'TC-021',
    message:
      'Festive Lucky Draw Winner! You won a free iPhone 16 Pro and Rs. 50,000 gift voucher. Claim your reward now at https://festival-spin.buzz/claim',
    expectedClassification: 'LIKELY_SCAM',
    category: 'lottery_prize_scam',
    explanation:
      'Fake lucky-draw giveaway luring victims onto a suspicious .buzz domain.',
    nature: 'suspicious',
  },
  {
    id: 'TC-022',
    message:
      'வாழ்த்துக்கள்! உங்கள் எண்ணிற்கு ரூ. 10,00,000 லாட்டரி பரிசு வென்றுள்ளீர்கள். உடனடியாக கிளிக் செய்யவும் https://prize-claim.test',
    expectedClassification: 'LIKELY_SCAM',
    category: 'lottery_prize_scam',
    explanation:
      'Tamil lottery scam claiming a 10 lakh rupee prize with an urgent claim link.',
    nature: 'suspicious',
  },

  // --- Category 7: Fake Jobs, Recruitment Fees, and Work-From-Home Schemes ---
  {
    id: 'TC-023',
    message:
      'Work from home opportunity! Earn Rs. 3,500 to Rs. 8,000 per day using mobile simply by liking YouTube videos. Instant daily payout. Join https://t.co/mockjob01',
    expectedClassification: 'LIKELY_SCAM',
    category: 'fake_job_scam',
    explanation:
      'Classic YouTube like-task scam promising unrealistic daily income via shortened link.',
    nature: 'suspicious',
  },
  {
    id: 'TC-024',
    message:
      'Congratulations, you are selected for Data Entry Executive work from home vacancy. Pay Rs. 1,500 refundable security deposit and laptop courier charge today.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'fake_job_scam',
    explanation:
      'Recruitment advance-fee fraud asking for a security deposit / laptop courier fee.',
    nature: 'suspicious',
  },
  {
    id: 'TC-025',
    message:
      'Complete 5 Google Maps hotel rating paid review tasks on Telegram prepaid task channel and earn Rs. 2,000 bonus commission every evening.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'fake_job_scam',
    explanation:
      'Prepaid Telegram rating-task scam that traps victims into depositing larger sums.',
    nature: 'suspicious',
  },
  {
    id: 'TC-026',
    message:
      'Hello, we are looking for flexible home-based income participants, no experience needed. Reply YES on WhatsApp for details.',
    expectedClassification: 'SUSPICIOUS',
    category: 'fake_job_scam',
    explanation:
      'Vague unsolicited work-from-home recruitment teaser; no fee asked yet, but a strong warning sign.',
    nature: 'suspicious',
  },

  // --- Category 8: Investment Fraud and Guaranteed Returns ---
  {
    id: 'TC-027',
    message:
      'Join our VIP Institutional Stock Trading WhatsApp group! Get 100% assured profit and guaranteed returns of 15% weekly with zero risk. Click https://vip-stocks.test',
    expectedClassification: 'LIKELY_SCAM',
    category: 'investment_fraud',
    explanation:
      'Promises risk-free guaranteed stock returns through an unregulated WhatsApp trading group.',
    nature: 'suspicious',
  },
  {
    id: 'TC-028',
    message:
      'Special Senior Citizen Crypto & Gold Plan: Double your money in 21 days with guaranteed daily income. Limited slots open today!',
    expectedClassification: 'LIKELY_SCAM',
    category: 'investment_fraud',
    explanation:
      'Impossible promise to double capital in 21 days targeting retirees.',
    nature: 'suspicious',
  },
  {
    id: 'TC-029',
    message:
      'Exclusive QIB institutional account access: Assured IPO allotment and 200% return on listing day. Download our trading app at http://ipo-vip.icu',
    expectedClassification: 'LIKELY_SCAM',
    category: 'investment_fraud',
    explanation:
      'Fake institutional trading app scam promising guaranteed IPO allotment and 200% gains.',
    nature: 'suspicious',
  },

  // --- Category 9: Government, Police, Tax, and Legal-Threat Impersonation ---
  {
    id: 'TC-030',
    message:
      'CBI & Cyber Crime Police Notice: An illegal parcel in your Aadhaar name was seized at Mumbai Customs. You are placed under digital arrest. Stay on video call and pay bail deposit.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'government_legal_threat',
    explanation:
      '"Digital arrest" extortion scam impersonating CBI/Customs; Indian law enforcement never conducts digital arrests.',
    nature: 'suspicious',
  },
  {
    id: 'TC-031',
    message:
      'TRAI Telecom Department Final Warning: All your mobile numbers will be disconnected in 2 hours due to illegal usage complaint. Press 9 to speak to investigating officer.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'government_legal_threat',
    explanation:
      'Impersonates TRAI threatening immediate SIM disconnection to route victims to fake police.',
    nature: 'suspicious',
  },
  {
    id: 'TC-032',
    message:
      'Electricity Board Urgent Notice: Your home electricity power will be disconnected tonight at 9:30 PM because last month bill update failed. Call officer 90000-22222 immediately.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'government_legal_threat',
    explanation:
      'Classic 9:30 PM electricity disconnection threat pushing the user to call a scammer mobile number.',
    nature: 'suspicious',
  },
  {
    id: 'TC-033',
    message:
      'Income Tax Department: Tax refund of Rs. 18,420 approved for your PAN. Click http://itd-refund-claim.xyz immediately to verify bank account before expiry.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'government_legal_threat',
    explanation:
      'Fake tax refund lure using an unencrypted phishing link.',
    nature: 'suspicious',
  },

  // --- Category 10: Remote-Access Applications and Suspicious App-Installation Requests ---
  {
    id: 'TC-034',
    message:
      'Bank Pension Support: To fix your life certificate error from home, please install AnyDesk from Play Store and share your 9-digit AnyDesk code with our officer.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'remote_access_scam',
    explanation:
      'Asks the user to install AnyDesk and share the remote access code, giving scammers full screen visibility.',
    nature: 'suspicious',
  },
  {
    id: 'TC-035',
    message:
      'Electricity Meter Update: Download and install our official bill update app Electricity_Support_v4.apk to avoid power cut tonight.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'remote_access_scam',
    explanation:
      'Instructs user to sideload a malicious .apk Android package disguised as a utility app.',
    nature: 'suspicious',
  },
  {
    id: 'TC-036',
    message:
      'Customer Care Desk: Open TeamViewer QuickSupport so our representative can help reverse the duplicate card charge on your phone.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'remote_access_scam',
    explanation:
      'Uses refund assistance as an excuse to connect via TeamViewer QuickSupport.',
    nature: 'suspicious',
  },

  // --- Category 11: Urgent Threats, Account Suspension, and Pressure Tactics ---
  {
    id: 'TC-037',
    message:
      'FINAL WARNING: Your membership profile faces immediate suspension within 20 minutes. Reply now to avoid losing access.',
    expectedClassification: 'SUSPICIOUS',
    category: 'urgency_pressure',
    explanation:
      'High-pressure 20-minute countdown threat designed to rush action, even without an explicit link yet.',
    nature: 'suspicious',
  },
  {
    id: 'TC-038',
    message:
      'URGENT: Failure to comply within 1 hour will result in account freeze and penalty charge. Verify at https://cutt.ly/mock-urgent01',
    expectedClassification: 'LIKELY_SCAM',
    category: 'urgency_pressure',
    explanation:
      'Combines severe 1-hour account-freeze pressure with an obfuscated shortened URL.',
    nature: 'suspicious',
  },
  {
    id: 'TC-039',
    message:
      'Act immediately or your medical reimbursement claim will be cancelled immediately today. Call 90000-33333.',
    expectedClassification: 'SUSPICIOUS',
    category: 'urgency_pressure',
    explanation:
      'Uses urgent cancellation pressure to push an immediate callback without independent verification.',
    nature: 'suspicious',
  },

  // --- Category 12: Requests to Share Personal or Financial Information ---
  {
    id: 'TC-040',
    message:
      'HR Compliance: Please reply with your Aadhaar card number and PAN card photo via email to update our vendor directory.',
    expectedClassification: 'SUSPICIOUS',
    category: 'personal_info_request',
    explanation:
      'Requests sensitive identity documents (Aadhaar and PAN copies) over message without verified context.',
    nature: 'suspicious',
  },
  {
    id: 'TC-041',
    message:
      'URGENT: Send your 16-digit card number, card expiry date, and date of birth and PAN within 15 minutes to prevent card permanently blocked.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'personal_info_request',
    explanation:
      'Demands full payment card and identity details under a 15-minute card-block threat.',
    nature: 'suspicious',
  },
  {
    id: 'TC-042',
    message:
      'Senior Welfare Survey: Please WhatsApp your full bank account number and IFSC along with passport copy for record update.',
    expectedClassification: 'SUSPICIOUS',
    category: 'personal_info_request',
    explanation:
      'Solicits sensitive banking and passport documents via WhatsApp.',
    nature: 'suspicious',
  },
  {
    id: 'TC-043',
    message:
      'Final Notice: Upload your Aadhaar card photo and mother\'s maiden name at https://verify-profile-id.top within 30 minutes.',
    expectedClassification: 'LIKELY_SCAM',
    category: 'personal_info_request',
    explanation:
      'Combines personal security-question harvesting, urgent deadline, and a suspicious .top link.',
    nature: 'suspicious',
  },
  {
    id: 'TC-044',
    message:
      'আপনার লটারি পুরস্কার জিতেছেন! অবিলম্বে আপনার OTP পাঠান এবং পুরস্কার গ্রহণ করুন।',
    expectedClassification: 'LIKELY_SCAM',
    category: 'credential_theft',
    explanation:
      'Bengali scam message combining fake lottery win with an urgent request to send OTP.',
    nature: 'suspicious',
  },

  // --- Legitimate Messages (Including Lookalikes That Mention Banks, OTPs, Bills, or Couriers) ---
  {
    id: 'TC-045',
    message:
      'Your SBI account XX4821 has been credited with INR 14,500.00 on 25-Oct-2026 via NEFT from Pension Treasury. Available balance: INR 52,110.00.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Standard informational bank credit notification with no links, threats, or requests for credentials.',
    nature: 'legitimate',
  },
  {
    id: 'TC-046',
    message:
      '839201 is your OTP for NetBanking login. Valid for 10 minutes. Do NOT share this OTP with anyone, even if they claim to be bank staff.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Legitimate one-time password message containing an explicit protective warning never to share the OTP.',
    nature: 'legitimate',
  },
  {
    id: 'TC-047',
    message:
      'Your BlueDart shipment #BD009182 is out for delivery today between 2:00 PM and 6:00 PM. No payment required upon delivery.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Standard delivery status notification with no external link and explicit confirmation that no payment is required.',
    nature: 'legitimate',
  },
  {
    id: 'TC-048',
    message:
      'Reminder: Electricity bill of Rs. 780 for Consumer ID 10004921 is due on 08-Nov-2026. Please pay only via your usual official electricity board portal or counter.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Routine bill reminder with no threat of tonight disconnection and no third-party link.',
    nature: 'legitimate',
  },
  {
    id: 'TC-049',
    message:
      'City Eye Clinic: Appointment confirmed for Mr. Rajan on Thursday 29-Oct at 10:30 AM with Dr. Meera. Please bring your previous glasses and prescription.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Normal medical clinic appointment confirmation.',
    nature: 'legitimate',
  },
  {
    id: 'TC-050',
    message:
      'Hi Appa, I reached Bengaluru safely on the morning train. Having breakfast now and will call you around 7 PM tonight.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Everyday personal family message.',
    nature: 'legitimate',
  },
  {
    id: 'TC-051',
    message:
      'Dear customer, our local bank branch will remain closed on Monday on account of a public holiday. ATM and official mobile banking services remain available.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Informational bank holiday notice with no links, threats, or requests.',
    nature: 'legitimate',
  },
  {
    id: 'TC-052',
    message:
      'Your monthly SIP of Rs. 2,000 in Folio XX9012 has been processed for Oct 2026 at NAV 44.18. Statement has been sent to your registered email.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Routine mutual fund SIP confirmation without links or guaranteed-return claims.',
    nature: 'legitimate',
  },
  {
    id: 'TC-053',
    message:
      'IRCTC PNR 4200019283: Train 12627 Coach B2 Berth 12 (Lower) confirmed for journey on 12-Nov-2026. Wishing you a pleasant journey.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Standard railway ticket confirmation message.',
    nature: 'legitimate',
  },
  {
    id: 'TC-054',
    message:
      'Public Library Notice: The book "Selected Short Stories" borrowed on your card is due back next Tuesday. You may return or renew it at the library desk.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Harmless community library return reminder.',
    nature: 'legitimate',
  },
  {
    id: 'TC-055',
    message:
      'Resident Welfare Association: Water tank cleaning is scheduled tomorrow from 11:00 AM to 1:00 PM in Block B. Kindly store sufficient water in advance.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Normal apartment community maintenance notice.',
    nature: 'legitimate',
  },
  {
    id: 'TC-056',
    message:
      'Pharmacy Update: Your monthly blood pressure tablets are ready for pickup at MedCare Store, Main Road. Total bill Rs. 340 payable at the shop counter.',
    expectedClassification: 'NO_OBVIOUS_SCAM',
    category: 'legitimate_lookalike',
    explanation:
      'Local neighbourhood pharmacy pickup message with in-person counter payment.',
    nature: 'legitimate',
  },
];

export const translations = {
  en: {
    // Header
    searchPlaceholder: 'Search claims, keywords, accounts…',
    
    // Navigation
    feed: 'Feed',
    trustDashboard: 'Trust Dashboard',
    mySubmissions: 'My Submissions',
    alerts: 'Alerts',
    settings: 'Settings',
    
    // Verdicts
    'Unverified': 'Unverified',
    'Accurate': 'Accurate',
    'Misleading': 'Misleading',
    'Out of Context': 'Out of Context',
    'Altered': 'Altered',
    
    // Common
    trustScore: 'Trust Score',
    confidence: 'Confidence',
    evidenceCount: 'Evidence Count',
    
    // Feed
    filterByMediaType: 'Filter by media type',
    filterByVerdict: 'Filter by verdict',
    openClaim: 'Open Claim',
    share: 'Share',
    followTopic: 'Follow Topic',
    reportError: 'Report Error',
    
    // Claim Detail
    overview: 'Overview',
    evidence: 'Evidence',
    mediaForensics: 'Media Forensics',
    lineage: 'Lineage',
    timelineCompare: 'Timeline Compare',
    
    // Dashboard
    totalFlagged: 'Total Flagged',
    percentMisleading: '% Misleading',
    medianTrustScore: 'Median Trust Score',
    avgVerificationLatency: 'Avg Verification Latency',
    
    // Sample content
    sampleClaim1: 'Candidate X promised to waive all student loans by 2026.',
    sampleClaim2: 'This rally video shows last night\'s crowd.',
    sampleClaim3: 'Fuel tax cut announced today.',
  },
  hi: {
    // Header
    searchPlaceholder: 'दावे, कीवर्ड, खाते खोजें…',
    
    // Navigation
    feed: 'फ़ीड',
    trustDashboard: 'ट्रस्ट डैशबोर्ड',
    mySubmissions: 'मेरे सबमिशन',
    alerts: 'अलर्ट',
    settings: 'सेटिंग्स',
    
    // Verdicts
    'Unverified': 'असत्यापित',
    'Accurate': 'सटीक',
    'Misleading': 'भ्रामक',
    'Out of Context': 'संदर्भ से बाहर',
    'Altered': 'बदला हुआ',
    
    // Common
    trustScore: 'ट्रस्ट स्कोर',
    confidence: 'विश्वसनीयता',
    evidenceCount: 'साक्ष्य संख्या',
    
    // Sample content
    sampleClaim1: 'उम्मीदवार X ने 2026 तक सभी छात्र ऋणों की माफी का वादा किया।',
    sampleClaim2: 'यह रैली वीडियो कल रात की भीड़ दिखाता है।',
    sampleClaim3: 'आज ईंधन कर में कटौती की घोषणा।',
  },
  mr: {
    // Header
    searchPlaceholder: 'दावे, कीवर्ड, खाती शोधा…',
    
    // Navigation
    feed: 'फीड',
    trustDashboard: 'ट्रस्ट डॅशबोर्ड',
    mySubmissions: 'माझे सबमिशन',
    alerts: 'अलर्ट',
    settings: 'सेटिंग्ज',
    
    // Verdicts
    'Unverified': 'असत्यापित',
    'Accurate': 'अचूक',
    'Misleading': 'दिशाभूल करणारे',
    'Out of Context': 'संदर्भाबाहेर',
    'Altered': 'बदललेले',
    
    // Sample content
    sampleClaim1: 'उमेदवार X ने 2026 पर्यंत सर्व विद्यार्थी कर्जे माफ करण्याचे वचन दिले.',
    sampleClaim2: 'हा रॅली व्हिडिओ काल रात्रीची गर्दी दाखवतो.',
    sampleClaim3: 'आज इंधन कर कपात जाहीर करण्यात आली.',
  },
};

export function t(key: string, language: string): string {
  return (translations as any)[language]?.[key] || (translations as any).en[key] || key;
}
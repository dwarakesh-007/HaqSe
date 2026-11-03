// All interface text in English, Telugu and Hindi.
// Translators: edit the strings here. Keep them short and simple.

import type { AreaId } from "./areas";

export type Lang = "en" | "te" | "hi";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];

export function toLang(v: string | null | undefined): Lang {
  return v === "te" || v === "hi" ? v : "en";
}

type Strings = {
  tagline: string;
  heroLine1: string;
  heroLine2: string;
  lede: string;
  state: string;
  language: string;
  pick: string;
  urgentTitle: string;
  urgentBefore: string;
  urgentAfter: string;
  how: string;
  steps: [string, string][];
  back: string;
  intro: string;
  tryOne: string;
  placeholderFirst: string;
  placeholderReply: string;
  send: string;
  speak: string;
  listening: string;
  quick: { label: string; text: string }[];
  letterBand: string;
  fillBrackets: string;
  download: string;
  writing: string;
  disclaimer: string;
  disclaimerShort: string;
  call: string;
  noAnswer: string;
  states: Record<string, string>;
  areas: Record<AreaId, { title: string; example: string; starters: string[] }>;
};

export const T: Record<Lang, Strings> = {
  en: {
    tagline: "Free legal help in simple words",
    heroLine1: "Know your rights.",
    heroLine2: "Take the next step.",
    lede: "Tell HaqSe what happened, in your own words. It explains what the law says, what to do next, and writes the letter for you. No lawyer fees.",
    state: "State",
    language: "Language",
    pick: "What do you need help with?",
    urgentTitle: "Lost money to a scam just now?",
    urgentBefore: "Call ",
    urgentAfter: " before anything else. The sooner you call, the better the chance of freezing the money.",
    how: "How it works",
    steps: [
      ["Tell us what happened.", "Type or speak, in English, Telugu or Hindi."],
      ["Understand your rights.", "Plain words, the exact next steps, and how strong your case is."],
      ["Get your letter.", "A ready complaint or application you can download and send."],
    ],
    back: "Back",
    intro: "Tell me what happened, in your own words. Don’t worry about legal terms.",
    tryOne: "Or start with one of these:",
    placeholderFirst: "Describe your problem…",
    placeholderReply: "Reply here…",
    send: "Send",
    speak: "Speak instead of typing",
    listening: "Listening…",
    quick: [
      { label: "Check my case strength", text: "How strong is my case? Do I have a real chance?" },
      { label: "What happens in court?", text: "What will happen if I go to court? Walk me through it." },
      { label: "Write my letter", text: "Please write the complaint letter for me now, in English, with the details I gave." },
    ],
    letterBand: "Your letter",
    fillBrackets: "Fill in anything in [brackets] before you send it.",
    download: "Download PDF",
    writing: "HaqSe is writing",
    disclaimer:
      "HaqSe gives general legal information, not legal advice. For serious cases, your District Legal Services Authority (DLSA) gives free legal aid. In danger? Call",
    disclaimerShort: "General legal information, not legal advice. In danger? Call",
    call: "Call",
    noAnswer: "No answer came back. Please try again.",
    states: { telangana: "Telangana", "andhra-pradesh": "Andhra Pradesh" },
    areas: {
      consumer: {
        title: "Consumer problems",
        example: "I got a broken phone online and they won't refund me",
        starters: [
          "I got a damaged product and the seller refuses a refund",
          "My warranty repair was refused",
          "A shop charged me more than the MRP",
        ],
      },
      "cyber-fraud": {
        title: "Cyber fraud",
        example: "Someone took money from my UPI after a fake call",
        starters: [
          "Money was taken from my UPI after a fake call",
          "I paid online but never got the product",
          "My social media account was hacked",
        ],
      },
      rti: {
        title: "Right to Information",
        example: "I want to know why my scholarship hasn't come",
        starters: [
          "I want to know the status of my pension or scholarship",
          "My RTI got no reply in 30 days",
          "How do I file an RTI about road work in my area?",
        ],
      },
    },
  },

  te: {
    tagline: "సరళమైన మాటల్లో ఉచిత న్యాయ సహాయం",
    heroLine1: "మీ హక్కులు తెలుసుకోండి.",
    heroLine2: "తదుపరి అడుగు వేయండి.",
    lede: "ఏం జరిగిందో మీ మాటల్లోనే HaqSe కి చెప్పండి. చట్టం ఏమంటుందో, తర్వాత ఏం చేయాలో వివరిస్తుంది, మీ కోసం లేఖ కూడా రాస్తుంది. లాయర్ ఫీజు అవసరం లేదు.",
    state: "రాష్ట్రం",
    language: "భాష",
    pick: "మీకు దేనిలో సహాయం కావాలి?",
    urgentTitle: "ఇప్పుడే మోసంలో డబ్బు పోయిందా?",
    urgentBefore: "అన్నిటికంటే ముందు ",
    urgentAfter: " కి కాల్ చేయండి. ఎంత త్వరగా కాల్ చేస్తే, డబ్బును ఫ్రీజ్ చేసే అవకాశం అంత ఎక్కువ.",
    how: "ఇది ఎలా పనిచేస్తుంది",
    steps: [
      ["ఏం జరిగిందో చెప్పండి.", "తెలుగు, ఇంగ్లీష్ లేదా హిందీలో టైప్ చేయండి లేదా మాట్లాడండి."],
      ["మీ హక్కులు అర్థం చేసుకోండి.", "సరళమైన మాటలు, తర్వాతి అడుగులు, మీ కేసు ఎంత బలంగా ఉందో."],
      ["మీ లేఖ పొందండి.", "డౌన్‌లోడ్ చేసి పంపగలిగే ఫిర్యాదు లేదా దరఖాస్తు."],
    ],
    back: "వెనక్కి",
    intro: "ఏం జరిగిందో మీ మాటల్లోనే చెప్పండి. న్యాయ పదాల గురించి చింతించకండి.",
    tryOne: "లేదా వీటిలో ఒకదానితో మొదలుపెట్టండి:",
    placeholderFirst: "మీ సమస్యను వివరించండి…",
    placeholderReply: "ఇక్కడ జవాబు ఇవ్వండి…",
    send: "పంపండి",
    speak: "టైప్ చేయడానికి బదులు మాట్లాడండి",
    listening: "వింటోంది…",
    quick: [
      { label: "నా కేసు ఎంత బలంగా ఉంది?", text: "నా కేసు ఎంత బలంగా ఉంది? నాకు నిజంగా గెలిచే అవకాశం ఉందా?" },
      { label: "కోర్టులో ఏం జరుగుతుంది?", text: "నేను కోర్టుకు వెళ్తే ఏం జరుగుతుంది? దశలవారీగా వివరించండి." },
      { label: "నా లేఖ రాయండి", text: "నేను ఇచ్చిన వివరాలతో ఇప్పుడు ఫిర్యాదు లేఖను ఇంగ్లీష్‌లో రాయండి." },
    ],
    letterBand: "మీ లేఖ",
    fillBrackets: "పంపే ముందు [బ్రాకెట్లలో] ఉన్నవి నింపండి.",
    download: "PDF డౌన్‌లోడ్",
    writing: "HaqSe రాస్తోంది",
    disclaimer:
      "HaqSe సాధారణ న్యాయ సమాచారం ఇస్తుంది, న్యాయ సలహా కాదు. తీవ్రమైన కేసులకు మీ జిల్లా న్యాయ సేవల ప్రాధికార సంస్థ (DLSA) ఉచిత న్యాయ సహాయం ఇస్తుంది. ప్రమాదంలో ఉన్నారా? కాల్ చేయండి",
    disclaimerShort: "సాధారణ న్యాయ సమాచారం, న్యాయ సలహా కాదు. ప్రమాదంలో ఉన్నారా? కాల్ చేయండి",
    call: "కాల్",
    noAnswer: "జవాబు రాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    states: { telangana: "తెలంగాణ", "andhra-pradesh": "ఆంధ్రప్రదేశ్" },
    areas: {
      consumer: {
        title: "వినియోగదారుల సమస్యలు",
        example: "ఆన్‌లైన్‌లో పగిలిన ఫోన్ వచ్చింది, రీఫండ్ ఇవ్వడం లేదు",
        starters: [
          "పాడైన వస్తువు వచ్చింది, అమ్మినవాళ్లు రీఫండ్ ఇవ్వడం లేదు",
          "నా వారంటీ రిపేర్‌ను తిరస్కరించారు",
          "షాపులో MRP కంటే ఎక్కువ వసూలు చేశారు",
        ],
      },
      "cyber-fraud": {
        title: "సైబర్ మోసం",
        example: "ఫేక్ కాల్ తర్వాత నా UPI నుండి డబ్బు పోయింది",
        starters: [
          "ఫేక్ కాల్ తర్వాత నా UPI నుండి డబ్బు పోయింది",
          "ఆన్‌లైన్‌లో డబ్బు కట్టాను కానీ వస్తువు రాలేదు",
          "నా సోషల్ మీడియా అకౌంట్ హ్యాక్ అయింది",
        ],
      },
      rti: {
        title: "సమాచార హక్కు (RTI)",
        example: "నా స్కాలర్‌షిప్ ఎందుకు రాలేదో తెలుసుకోవాలి",
        starters: [
          "నా పెన్షన్ లేదా స్కాలర్‌షిప్ స్టేటస్ తెలుసుకోవాలి",
          "30 రోజులైనా నా RTI కి జవాబు రాలేదు",
          "మా ఏరియా రోడ్డు పనుల గురించి RTI ఎలా వేయాలి?",
        ],
      },
    },
  },

  hi: {
    tagline: "आसान शब्दों में मुफ़्त कानूनी मदद",
    heroLine1: "अपने अधिकार जानिए।",
    heroLine2: "अगला कदम उठाइए।",
    lede: "जो हुआ, अपने शब्दों में HaqSe को बताइए। यह बताता है कि कानून क्या कहता है, आगे क्या करना है, और आपके लिए पत्र भी लिखता है। वकील की फ़ीस नहीं।",
    state: "राज्य",
    language: "भाषा",
    pick: "आपको किसमें मदद चाहिए?",
    urgentTitle: "अभी-अभी ठगी में पैसे गए?",
    urgentBefore: "सबसे पहले ",
    urgentAfter: " पर कॉल करें। जितनी जल्दी कॉल करेंगे, पैसा फ़्रीज़ होने की संभावना उतनी ज़्यादा।",
    how: "यह कैसे काम करता है",
    steps: [
      ["बताइए क्या हुआ।", "हिंदी, अंग्रेज़ी या तेलुगु में लिखिए या बोलिए।"],
      ["अपने अधिकार समझिए।", "आसान शब्द, आगे के सही कदम, और आपका केस कितना मज़बूत है।"],
      ["अपना पत्र पाइए।", "तैयार शिकायत या आवेदन, जिसे डाउनलोड करके भेज सकते हैं।"],
    ],
    back: "वापस",
    intro: "जो हुआ, अपने शब्दों में बताइए। कानूनी शब्दों की चिंता मत कीजिए।",
    tryOne: "या इनमें से किसी एक से शुरू कीजिए:",
    placeholderFirst: "अपनी समस्या बताइए…",
    placeholderReply: "यहाँ जवाब लिखिए…",
    send: "भेजें",
    speak: "लिखने की जगह बोलिए",
    listening: "सुन रहा है…",
    quick: [
      { label: "मेरा केस कितना मज़बूत है?", text: "मेरा केस कितना मज़बूत है? क्या मेरे जीतने की सच में संभावना है?" },
      { label: "कोर्ट में क्या होगा?", text: "अगर मैं कोर्ट जाऊँ तो क्या होगा? कदम-दर-कदम समझाइए।" },
      { label: "मेरा पत्र लिखिए", text: "मेरे दिए विवरणों से अब शिकायत पत्र अंग्रेज़ी में लिखिए।" },
    ],
    letterBand: "आपका पत्र",
    fillBrackets: "भेजने से पहले [ब्रैकेट] वाली जानकारी भरिए।",
    download: "PDF डाउनलोड करें",
    writing: "HaqSe लिख रहा है",
    disclaimer:
      "HaqSe सामान्य कानूनी जानकारी देता है, कानूनी सलाह नहीं। गंभीर मामलों में आपका ज़िला विधिक सेवा प्राधिकरण (DLSA) मुफ़्त कानूनी मदद देता है। ख़तरे में हैं? कॉल करें",
    disclaimerShort: "सामान्य कानूनी जानकारी, कानूनी सलाह नहीं। ख़तरे में हैं? कॉल करें",
    call: "कॉल",
    noAnswer: "कोई जवाब नहीं आया। कृपया फिर से कोशिश करें।",
    states: { telangana: "तेलंगाना", "andhra-pradesh": "आंध्र प्रदेश" },
    areas: {
      consumer: {
        title: "उपभोक्ता समस्याएँ",
        example: "ऑनलाइन टूटा फ़ोन आया और वे रिफ़ंड नहीं दे रहे",
        starters: [
          "खराब सामान मिला और विक्रेता रिफ़ंड नहीं दे रहा",
          "मेरी वारंटी रिपेयर मना कर दी गई",
          "दुकान ने MRP से ज़्यादा पैसे लिए",
        ],
      },
      "cyber-fraud": {
        title: "साइबर ठगी",
        example: "फ़र्ज़ी कॉल के बाद मेरे UPI से पैसे कट गए",
        starters: [
          "फ़र्ज़ी कॉल के बाद मेरे UPI से पैसे कट गए",
          "ऑनलाइन पैसे दिए पर सामान नहीं मिला",
          "मेरा सोशल मीडिया अकाउंट हैक हो गया",
        ],
      },
      rti: {
        title: "सूचना का अधिकार (RTI)",
        example: "जानना है कि मेरी स्कॉलरशिप क्यों नहीं आई",
        starters: [
          "मेरी पेंशन या स्कॉलरशिप का स्टेटस जानना है",
          "30 दिन में मेरी RTI का जवाब नहीं आया",
          "अपने इलाके की सड़क के काम के बारे में RTI कैसे डालें?",
        ],
      },
    },
  },
};

const KEY = "haqse-lang";
export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? toLang(v) : null;
  } catch {
    return null;
  }
}
export function saveLang(l: Lang) {
  try {
    localStorage.setItem(KEY, l);
  } catch {
    // storage blocked: the choice still works for this visit
  }
}

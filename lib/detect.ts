import type { AreaId } from "./areas";

// Guess the legal area from what the person typed (English, Telugu, Hindi).
// Simple keyword matching: good enough to pick a starting point. The person can always go back.

const RULES: { area: AreaId; words: string[] }[] = [
  {
    area: "cyber-fraud",
    words: [
      "upi", "otp", "scam", "fraud", "fake call", "hack", "hacked", "cyber", "phishing", "link", "digital arrest",
      "online fraud", "money deducted", "money taken", "account hacked", "loan app", "sextortion", "1930",
      "మోసం", "ఫ్రాడ్", "హ్యాక్", "ఫేక్ కాల్", "ఓటీపీ", "సైబర్",
      "ठगी", "धोखा", "फ़्रॉड", "फ्रॉड", "हैक", "फ़र्ज़ी", "फर्जी", "साइबर", "ओटीपी",
    ],
  },
  {
    area: "rti",
    words: [
      "rti", "right to information", "information from", "government office", "status of my", "pension", "scholarship",
      "ration card", "certificate", "public information officer", "pio", "municipal", "panchayat",
      "సమాచార హక్కు", "పెన్షన్", "స్కాలర్‌షిప్", "రేషన్", "ప్రభుత్వ",
      "सूचना", "पेंशन", "स्कॉलरशिप", "राशन", "सरकारी",
    ],
  },
];

export function detectArea(text: string): AreaId {
  const t = text.toLowerCase();
  let best: { area: AreaId; hits: number } = { area: "consumer", hits: 0 };
  for (const r of RULES) {
    const hits = r.words.filter((w) => t.includes(w)).length;
    if (hits > best.hits) best = { area: r.area, hits };
  }
  return best.area;
}

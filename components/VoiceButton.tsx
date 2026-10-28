"use client";

import { useEffect, useState } from "react";

// Uses the browser's built-in speech recognition (works in Chrome on phone and laptop).
// Later we can switch to Bhashini for better Telugu/Hindi support.

const SPEECH_LANG: Record<string, string> = { en: "en-IN", te: "te-IN", hi: "hi-IN" };

export default function VoiceButton({ lang, onText }: { lang: string; onText: (t: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  if (!supported) return null;

  function start() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = SPEECH_LANG[lang] ?? "en-IN";
    rec.interimResults = false;
    rec.onresult = (e: { results: { 0: { transcript: string } }[] }) => onText(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }

  return (
    <button
      type="button"
      className={`mic ${listening ? "on" : ""}`}
      onClick={start}
      aria-label={listening ? "Listening" : "Speak instead of typing"}
      title={listening ? "Listening…" : "Speak"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
        <path d="M12 17.5V21" />
      </svg>
    </button>
  );
}

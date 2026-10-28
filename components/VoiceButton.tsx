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
    <button type="button" className={`mic ${listening ? "on" : ""}`} onClick={start} aria-label="Speak">
      {listening ? "Listening…" : "🎤"}
    </button>
  );
}

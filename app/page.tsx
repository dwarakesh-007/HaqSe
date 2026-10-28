"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS, STATES } from "@/lib/areas";

const LANGS = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState(STATES[0].code);
  const [language, setLanguage] = useState("en");

  return (
    <div className="home">
      <section className="hero">
        <h1>
          Know your rights.
          <br />
          Take the next step.
        </h1>
        <p className="lede">
          Tell HaqSe what happened, in your own words. It explains what the law says, what to do next, and writes the
          letter for you. No lawyer fees.
        </p>
      </section>

      <section className="setup" aria-label="Your details">
        <label className="field">
          <span>State</span>
          <select value={state} onChange={(e) => setState(e.target.value)}>
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <div className="field">
          <span id="lang-label">Language</span>
          <div className="segmented" role="radiogroup" aria-labelledby="lang-label">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                role="radio"
                aria-checked={language === l.code}
                className={language === l.code ? "on" : ""}
                onClick={() => setLanguage(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick">What do you need help with?</h2>
        <ul className="topics">
          {AREAS.map((a) => (
            <li key={a.id}>
              <button
                className="topic"
                onClick={() => router.push(`/chat?area=${a.id}&state=${state}&lang=${language}`)}
              >
                <span className="topic-icon" aria-hidden>
                  {a.emoji}
                </span>
                <span className="topic-text">
                  <strong>{a.title}</strong>
                  <em>&ldquo;{a.example}&rdquo;</em>
                </span>
                <span className="topic-go" aria-hidden>
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="urgent">
        <strong>Lost money to a scam just now?</strong>
        <span>
          Call <a href="tel:1930">1930</a> before anything else. The sooner you call, the better the chance of freezing
          the money.
        </span>
      </aside>

      <section aria-labelledby="how" className="how">
        <h2 id="how">How it works</h2>
        <ol>
          <li>
            <strong>Tell us what happened.</strong> Type or speak, in English, Telugu or Hindi.
          </li>
          <li>
            <strong>Understand your rights.</strong> Plain words, the exact next steps, and how strong your case is.
          </li>
          <li>
            <strong>Get your letter.</strong> A ready complaint or application you can download and send.
          </li>
        </ol>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS, STATES } from "@/lib/areas";

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState(STATES[0].code);
  const [language, setLanguage] = useState("en");

  return (
    <div className="home">
      <section className="hero">
        <h1>Your rights, in simple words.</h1>
        <p>Tell us your problem. We explain what the law says, what to do next, and write the letter for you. Free.</p>
      </section>

      <section className="pickers">
        <label>
          Your state
          <select value={state} onChange={(e) => setState(e.target.value)}>
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </label>
      </section>

      <h2>What do you need help with?</h2>
      <section className="areas">
        {AREAS.map((a) => (
          <button
            key={a.id}
            className="area-card"
            onClick={() => router.push(`/chat?area=${a.id}&state=${state}&lang=${language}`)}
          >
            <span className="emoji">{a.emoji}</span>
            <strong>{a.title}</strong>
            <em>&ldquo;{a.example}&rdquo;</em>
          </button>
        ))}
      </section>

      <section className="urgent">
        <strong>Lost money to a scam just now?</strong> Call <a href="tel:1930">1930</a> first. Every minute counts.
      </section>
    </div>
  );
}

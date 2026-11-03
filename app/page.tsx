"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS, STATES } from "@/lib/areas";
import { LANGS, T, saveLang, savedLang, type Lang } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState(STATES[0].code);
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  useEffect(() => {
    const l = savedLang();
    if (l) setLang(l);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function chooseLang(l: Lang) {
    setLang(l);
    saveLang(l);
  }

  return (
    <>
      <header className="topbar">
        <a href="/" className="wordmark" aria-label="HaqSe">
          HaqSe
        </a>
        <span className="topbar-note">{t.tagline}</span>
      </header>

      <main className="home">
        <section className="hero">
          <h1>
            {t.heroLine1}
            <br />
            {t.heroLine2}
          </h1>
          <p className="lede">{t.lede}</p>
        </section>

        <section className="setup" aria-label={`${t.state} / ${t.language}`}>
          <label className="field">
            <span>{t.state}</span>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {t.states[s.code] ?? s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span id="lang-label">{t.language}</span>
            <div className="segmented" role="radiogroup" aria-labelledby="lang-label">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  role="radio"
                  lang={l.code}
                  aria-checked={lang === l.code}
                  className={lang === l.code ? "on" : ""}
                  onClick={() => chooseLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="pick">
          <h2 id="pick">{t.pick}</h2>
          <ul className="topics">
            {AREAS.map((a) => (
              <li key={a.id}>
                <button
                  className="topic"
                  onClick={() => router.push(`/chat?area=${a.id}&state=${state}&lang=${lang}`)}
                >
                  <span className="topic-icon" aria-hidden>
                    {a.emoji}
                  </span>
                  <span className="topic-text">
                    <strong>{t.areas[a.id].title}</strong>
                    <em>&ldquo;{t.areas[a.id].example}&rdquo;</em>
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
          <strong>{t.urgentTitle}</strong>
          <span>
            {t.urgentBefore}
            <a href="tel:1930">1930</a>
            {t.urgentAfter}
          </span>
        </aside>

        <section aria-labelledby="how" className="how">
          <h2 id="how">{t.how}</h2>
          <ol>
            {t.steps.map(([head, body]) => (
              <li key={head}>
                <strong>{head}</strong> {body}
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="footer">
        <p>
          {t.disclaimer} <a href="tel:112">112</a>.
        </p>
      </footer>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS, STATES } from "@/lib/areas";
import { LANGS, T, saveLang, savedLang, type Lang } from "@/lib/i18n";
import { detectArea } from "@/lib/detect";
import { AREA_ICONS, ChevronRight, PinIcon } from "@/components/Icons";
import VoiceButton from "@/components/VoiceButton";

const SHORT_LABEL: Record<Lang, string> = { en: "EN", te: "తె", hi: "हि" };

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState(STATES[0].code);
  const [lang, setLang] = useState<Lang>("en");
  const [problem, setProblem] = useState("");
  const boxRef = useRef<HTMLTextAreaElement>(null);
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

  function openChat(area: string, q?: string) {
    const params = new URLSearchParams({ area, state, lang });
    if (q) params.set("q", q);
    router.push(`/chat?${params.toString()}`);
  }

  function ask() {
    const q = problem.trim();
    if (!q) {
      boxRef.current?.focus();
      return;
    }
    openChat(detectArea(q), q);
  }

  return (
    <>
      <header className="topbar wide">
        <a href="/" className="wordmark" aria-label="HaqSe">
          HaqSe
        </a>
        <div className="lang-switch" role="radiogroup" aria-label={t.language}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="radio"
              lang={l.code}
              aria-checked={lang === l.code}
              aria-label={l.label}
              className={lang === l.code ? "on" : ""}
              onClick={() => chooseLang(l.code)}
            >
              <span className="long">{l.label}</span>
              <span className="short" aria-hidden>
                {SHORT_LABEL[l.code]}
              </span>
            </button>
          ))}
        </div>
      </header>

      <main className="home wide">
        <div className="hero-grid">
          <section className="hero-main">
            <h1>
              {t.heroLine1}
              <br />
              {t.heroLine2}
            </h1>
            <p className="lede">{t.lede}</p>

            <form
              className="ask"
              onSubmit={(e) => {
                e.preventDefault();
                ask();
              }}
            >
              <label htmlFor="problem" className="ask-label">
                {t.askLabel}
              </label>
              <textarea
                id="problem"
                ref={boxRef}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={t.askPlaceholder}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask();
                  }
                }}
              />
              <div className="ask-bar">
                <label className="state-chip">
                  <PinIcon />
                  <span className="sr-only">{t.yourState}</span>
                  <select value={state} onChange={(e) => setState(e.target.value)} aria-label={t.yourState}>
                    {STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {t.states[s.code] ?? s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="ask-actions">
                  <VoiceButton
                    lang={lang}
                    label={t.speak}
                    listeningLabel={t.listening}
                    onText={(x) => setProblem((v) => (v ? v + " " : "") + x)}
                  />
                  <button type="submit" className="primary">
                    {t.getHelp}
                  </button>
                </div>
              </div>
            </form>

            <h2 className="or-topic">{t.orTopic}</h2>
            <ul className="topics">
              {AREAS.map((a) => {
                const Icon = AREA_ICONS[a.id];
                return (
                  <li key={a.id}>
                    <button className="topic" onClick={() => openChat(a.id)}>
                      <span className="topic-icon">
                        <Icon />
                      </span>
                      <span className="topic-text">
                        <strong>{t.areas[a.id].title}</strong>
                        <em>&ldquo;{t.areas[a.id].example}&rdquo;</em>
                      </span>
                      <span className="topic-go">
                        <ChevronRight />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="hero-preview" aria-label={t.exampleTag}>
            <figure className="sheet preview">
              <div className="sheet-band">
                <span>{t.letterBand}</span>
                <span className="tag">{t.exampleTag}</span>
              </div>
              <span className="seal" aria-hidden>
                Draft
              </span>
              <div className="letter" lang="en">
                <p>
                  To,
                  <br />
                  The Store Manager,
                  <br />
                  [Store name and address]
                </p>
                <p className="subject">Subject: Complaint about a defective laptop, Bill No. [number]</p>
                <p>Dear Sir/Madam,</p>
                <p>
                  I bought a laptop from your store on [date] for Rs [amount]. It did not work from the first day. I
                  ask you to replace it or refund the full amount within 15 days, as is my right under the Consumer
                  Protection Act, 2019.
                </p>
                <p>
                  Yours faithfully,
                  <br />
                  [Your name]
                </p>
              </div>
              <figcaption>{t.previewNote}</figcaption>
            </figure>
          </aside>
        </div>

        <div className="below">
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
        </div>
      </main>

      <footer className="footer wide">
        <p>
          {t.disclaimer} <a href="tel:112">112</a>.
        </p>
      </footer>
    </>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getArea, STATES } from "@/lib/areas";
import { downloadPdf, extractDocument } from "@/lib/pdf";
import { T, toLang } from "@/lib/i18n";
import VoiceButton from "@/components/VoiceButton";
import Markdown from "@/components/Markdown";
import { AREA_ICONS } from "@/components/Icons";

type Msg = { role: "user" | "assistant"; content: string; document?: string };

function Chat() {
  const params = useSearchParams();
  const router = useRouter();
  const firstQ = params.get("q");
  const sentFirst = useRef(false);
  const areaId = params.get("area") ?? "consumer";
  const state = params.get("state") ?? "telangana";
  const lang = toLang(params.get("lang"));
  const t = T[lang];
  const area = getArea(areaId);
  const stateName = t.states[state] ?? STATES.find((s) => s.code === state)?.name ?? state;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  // Let the text box grow with what you type, up to a limit.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  // A problem typed on the home page is sent right away, once.
  useEffect(() => {
    if (!firstQ || sentFirst.current || !area) return;
    sentFirst.current = true;
    const p = new URLSearchParams(params.toString());
    p.delete("q");
    router.replace(`/chat?${p.toString()}`);
    send(firstQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!area) {
    return (
      <main className="chat">
        <p>
          <a href="/">{t.back}</a>
        </p>
      </main>
    );
  }
  const areaText = t.areas[area.id];
  const AreaIcon = AREA_ICONS[area.id];

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: areaId,
          state,
          language: lang,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t.noAnswer);
      }

      // Show the answer word by word as it arrives.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const visible = reply.split("<<<DOCUMENT")[0];
        setLoading(false);
        setMessages([...next, { role: "assistant", content: visible }]);
      }
      if (!reply.trim()) throw new Error(t.noAnswer);
      const { message, document } = extractDocument(reply);
      setMessages([...next, { role: "assistant", content: message, document }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.noAnswer);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const started = messages.length > 0;

  return (
    <main className="chat">
      <header className="chat-head">
        <a href="/" className="back" aria-label={t.back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span>{t.back}</span>
        </a>
        <div className="chat-title">
          <strong>
            <AreaIcon size={20} /> {areaText.title}
          </strong>
          <span>{stateName}</span>
        </div>
      </header>

      <div className="messages" aria-live="polite">
        {!started && (
          <div className="welcome">
            {area.id === "cyber-fraud" && (
              <aside className="urgent compact">
                <strong>{t.urgentTitle}</strong>
                <span>
                  {t.urgentBefore}
                  <a href="tel:1930">1930</a>
                  {t.urgentAfter}
                </span>
              </aside>
            )}
            <p className="welcome-lead">{t.intro}</p>
            <p className="welcome-sub">{t.tryOne}</p>
            <ul className="starters">
              {areaText.starters.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)}>
                    <span>{s}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === "assistant" ? <Markdown text={m.content} /> : <p>{m.content}</p>}
            {m.document && (
              <figure className="sheet">
                <div className="sheet-band" aria-hidden>
                  <span>{t.letterBand}</span>
                </div>
                <span className="seal" aria-hidden>
                  Draft
                </span>
                <pre lang="en">{m.document}</pre>
                <figcaption>
                  <span>{t.fillBrackets}</span>
                  <button type="button" onClick={() => downloadPdf(m.document!, `haqse-${areaId}.pdf`)}>
                    {t.download}
                  </button>
                </figcaption>
              </figure>
            )}
          </div>
        ))}

        {loading && (
          <div className="msg assistant typing" role="status" aria-label={t.writing}>
            <i />
            <i />
            <i />
          </div>
        )}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="dock">
        {started && !loading && (
          <div className="quick">
            {t.quick.map((q) => (
              <button key={q.label} type="button" onClick={() => send(q.text)}>
                {q.label}
              </button>
            ))}
          </div>
        )}

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={started ? t.placeholderReply : t.placeholderFirst}
            aria-label={started ? t.placeholderReply : t.placeholderFirst}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <VoiceButton
            lang={lang}
            label={t.speak}
            listeningLabel={t.listening}
            onText={(x) => setInput((v) => (v ? v + " " : "") + x)}
          />
          <button type="submit" className="send" disabled={loading || !input.trim()} aria-label={t.send}>
            <span>{t.send}</span>
          </button>
        </form>
        <p className="fineprint">
          {t.disclaimerShort} <a href="tel:112">112</a>.
        </p>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<main className="chat" />}>
      <Chat />
    </Suspense>
  );
}

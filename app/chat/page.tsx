"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getArea, STATES } from "@/lib/areas";
import { downloadPdf, extractDocument } from "@/lib/pdf";
import VoiceButton from "@/components/VoiceButton";
import Markdown from "@/components/Markdown";

const QUICK = [
  { label: "Check my case strength", text: "How strong is my case? Do I have a real chance?" },
  { label: "What happens in court?", text: "What will happen if I go to court? Walk me through it." },
  { label: "Write my letter", text: "Please write the complaint letter for me now with the details I gave." },
];

type Msg = { role: "user" | "assistant"; content: string; document?: string };

function Chat() {
  const params = useSearchParams();
  const areaId = params.get("area") ?? "consumer";
  const state = params.get("state") ?? "telangana";
  const lang = params.get("lang") ?? "en";
  const area = getArea(areaId);
  const stateName = STATES.find((s) => s.code === state)?.name ?? state;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!area) return <p>Unknown topic. <a href="/">Go back</a></p>;

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
        throw new Error(data.error || "Something went wrong.");
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
      if (!reply.trim()) throw new Error("No answer came back. Please try again.");
      const { message, document } = extractDocument(reply);
      setMessages([...next, { role: "assistant", content: message, document }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat-head">
        <a href="/" className="back">
          ‹ Back
        </a>
        <div className="chat-title">
          <strong>
            <span aria-hidden>{area.emoji}</span> {area.title}
          </strong>
          <span>{stateName}</span>
        </div>
      </div>

      <div className="messages" aria-live="polite">
        {messages.length === 0 && (
          <div className="msg assistant intro">
            <p>Tell me what happened, in your own words. Don&rsquo;t worry about legal terms.</p>
            <button type="button" className="example" onClick={() => setInput(area.example)}>
              For example: &ldquo;{area.example}&rdquo;
            </button>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === "assistant" ? <Markdown text={m.content} /> : <p>{m.content}</p>}
            {m.document && (
              <figure className="sheet">
                <div className="sheet-band" aria-hidden>
                  <span>Draft letter</span>
                </div>
                <span className="seal" aria-hidden>
                  Draft
                </span>
                <pre>{m.document}</pre>
                <figcaption>
                  <span>Fill in anything in [brackets] before you send it.</span>
                  <button type="button" onClick={() => downloadPdf(m.document!, `haqse-${areaId}.pdf`)}>
                    Download PDF
                  </button>
                </figcaption>
              </figure>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg assistant typing" aria-label="HaqSe is writing">
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
        {messages.length > 0 && !loading && (
          <div className="quick">
            {QUICK.map((q) => (
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={messages.length ? "Reply here…" : "Describe your problem…"}
            aria-label="Your message"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <VoiceButton lang={lang} onText={(t) => setInput((v) => (v ? v + " " : "") + t)} />
          <button type="submit" className="send" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Chat />
    </Suspense>
  );
}

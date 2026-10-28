"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getArea, STATES } from "@/lib/areas";
import { downloadPdf, extractDocument } from "@/lib/pdf";
import VoiceButton from "@/components/VoiceButton";

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

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      const { message, document } = extractDocument(data.reply);
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
        <a href="/">← Back</a>
        <span>
          {area.emoji} {area.title} · {stateName}
        </span>
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="bubble assistant">
            Hi! Tell me what happened, in your own words. For example: &ldquo;{area.example}&rdquo;
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <div className="text">{m.content}</div>
            {m.document && (
              <div className="doc">
                <pre>{m.document}</pre>
                <button onClick={() => downloadPdf(m.document!, `haqse-${areaId}.pdf`)}>Download as PDF</button>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="bubble assistant typing">Thinking…</div>}
        {error && <div className="error">{error}</div>}
        <div ref={endRef} />
      </div>

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
          placeholder="Type your problem here…"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
        />
        <VoiceButton lang={lang} onText={(t) => setInput((v) => (v ? v + " " : "") + t)} />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
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

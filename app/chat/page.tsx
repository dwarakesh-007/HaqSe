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

      {messages.length > 0 && !loading && (
        <div className="quick">
          <button type="button" onClick={() => send("How strong is my case? Do I have a real chance?")}>
            ⚖️ Check my case strength
          </button>
          <button type="button" onClick={() => send("What will happen if I go to court? Walk me through it.")}>
            🏛️ What happens in court?
          </button>
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

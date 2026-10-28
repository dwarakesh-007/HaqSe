// Talks to the AI model. Kept in one file so we can switch providers later.

export type ChatMessage = { role: "user" | "assistant"; content: string };

const API = "https://generativelanguage.googleapis.com/v1beta";
const FIRST_RESPONSE_TIMEOUT_MS = 30_000; // how long to wait for Google to start answering
const IDLE_TIMEOUT_MS = 60_000; // how long to wait between chunks once it has started

const log = (...args: unknown[]) => console.log("[HaqSe AI]", ...args);

function friendly(err: unknown, step: string): Error {
  const e = err as { name?: string; message?: string; cause?: { code?: string; message?: string } };
  if (e?.name === "TimeoutError" || e?.name === "AbortError") {
    return new Error(`Google didn't respond in time (${step}). Check your internet and try again.`);
  }
  const code = e?.cause?.code ? ` [${e.cause.code}]` : "";
  return new Error(`Couldn't reach Google (${step})${code}: ${e?.cause?.message ?? e?.message ?? "unknown error"}`);
}

// Google retires model names over time and the newest model is sometimes overloaded.
// So we keep a list of candidate models (newest first) and fall back down the list
// whenever one is retired (404), busy (503) or rate-limited (429).
let candidates: string[] | null = null;
let preferred: string | null = null; // the last model that worked

async function getCandidates(key: string): Promise<string[]> {
  if (candidates) return candidates;
  const t = Date.now();
  log("finding available models…");
  let res: Response;
  try {
    res = await fetch(`${API}/models?pageSize=1000`, {
      headers: { "x-goog-api-key": key },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    throw friendly(err, "finding a model");
  }
  if (!res.ok) throw new Error(`Could not list AI models (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as {
    models?: { name: string; supportedGenerationMethods?: string[] }[];
  };
  const usable = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""));

  const version = (n: string) => parseFloat(n.match(/gemini-([\d.]+)/)?.[1] ?? "0");
  const stableFlash = usable.filter((n) => /^gemini-[\d.]+-flash$/.test(n)).sort((a, b) => version(b) - version(a));
  const extras = ["gemini-flash-latest"].filter((n) => usable.includes(n));
  candidates = [...stableFlash, ...extras];
  if (candidates.length === 0) throw new Error("No usable Gemini model found for this API key.");
  log(`candidates: ${candidates.join(", ")} (took ${Date.now() - t} ms)`);
  return candidates;
}

// Newer models "think" before answering, which is slow. Ask for light thinking.
// Different model families use different settings, so we try them in order.
const THINKING_OPTIONS: (Record<string, unknown> | undefined)[] = [
  { thinkingLevel: "low" }, // Gemini 3.x and later
  { thinkingBudget: 0 }, // Gemini 2.5
  undefined, // models without thinking
];
const workingThinking = new Map<string, number>(); // which thinking option each model accepts

async function startStream(model: string, key: string, system: string, messages: ChatMessage[]) {
  const known = workingThinking.get(model);
  const options = known === undefined ? THINKING_OPTIONS.map((_, i) => i) : [known];
  let last: Response | undefined;
  for (const i of options) {
    const thinkingConfig = THINKING_OPTIONS[i];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new DOMException("timeout", "TimeoutError")), FIRST_RESPONSE_TIMEOUT_MS);
    const t = Date.now();
    try {
      last = await fetch(`${API}/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { temperature: 0.3, ...(thinkingConfig ? { thinkingConfig } : {}) },
        }),
      });
    } catch (err) {
      throw friendly(err, "asking the AI");
    } finally {
      clearTimeout(timer);
    }
    log(`${model} replied ${last.status} in ${Date.now() - t} ms (thinking: ${JSON.stringify(thinkingConfig ?? "default")})`);
    // 400 means this model doesn't accept that thinking setting: try the next one.
    if (last.status !== 400) {
      if (last.ok) workingThinking.set(model, i);
      return last;
    }
  }
  return last!;
}

// Returns a stream of plain text chunks as the model writes its answer.
export async function streamModel(system: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your-key-here") {
    throw new Error("GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key.");
  }

  const list = await getCandidates(key);
  const order = [
    ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
    ...(preferred ? [preferred] : []),
    ...list,
  ].filter((m, i, a) => a.indexOf(m) === i);

  let res: Response | undefined;
  let lastError = "";
  for (const model of order) {
    try {
      res = await startStream(model, key, system, messages);
    } catch (err) {
      lastError = (err as Error).message;
      log(`${model} failed: ${lastError}`);
      continue;
    }
    if (res.ok && res.body) {
      preferred = model;
      break;
    }
    lastError = `${model} (${res.status}): ${(await res.text()).slice(0, 200)}`;
    log(`skipping ${lastError}`);
    if (![404, 429, 500, 503].includes(res.status)) break; // a real error (e.g. bad key): stop
    if (preferred === model) preferred = null;
    res = undefined;
  }

  if (!res || !res.ok || !res.body) {
    throw new Error(`The AI is busy right now. Please try again in a minute. (${lastError})`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  let buffer = "";

  const readWithIdleTimeout = () =>
    Promise.race([
      reader.read(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Google stopped sending the answer midway. Please try again.")), IDLE_TIMEOUT_MS)
      ),
    ]);

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await readWithIdleTimeout();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const json = JSON.parse(line.slice(5));
            const parts: { text?: string; thought?: boolean }[] = json?.candidates?.[0]?.content?.parts ?? [];
            const text = parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // ignore partial or non-JSON lines
          }
        }
      } catch (err) {
        reader.cancel().catch(() => {});
        controller.enqueue(encoder.encode(`\n\n⚠️ ${(err as Error).message}`));
        controller.close();
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

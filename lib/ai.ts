// Talks to the AI model. Kept in one file so we can switch providers later.

export type ChatMessage = { role: "user" | "assistant"; content: string };

const API = "https://generativelanguage.googleapis.com/v1beta";

// Google retires model names over time. If GEMINI_MODEL isn't set (or stops working),
// we ask Google which models this key can use and pick the newest stable "flash" one.
let cachedModel: string | null = null;

async function pickModel(key: string): Promise<string> {
  if (cachedModel) return cachedModel;
  const res = await fetch(`${API}/models?pageSize=1000`, { headers: { "x-goog-api-key": key } });
  if (!res.ok) throw new Error(`Could not list AI models (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as {
    models?: { name: string; supportedGenerationMethods?: string[] }[];
  };

  const usable = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""));

  const isFlash = (n: string) => /^gemini-[\d.]+-flash$/.test(n); // stable names only, e.g. gemini-2.5-flash
  const version = (n: string) => parseFloat(n.match(/gemini-([\d.]+)/)?.[1] ?? "0");

  const best =
    usable.filter(isFlash).sort((a, b) => version(b) - version(a))[0] ??
    usable.filter((n) => n.includes("flash") && !/(image|tts|audio|live|embedding)/.test(n)).sort((a, b) => version(b) - version(a))[0];

  if (!best) throw new Error("No usable Gemini model found for this API key.");
  cachedModel = best;
  return best;
}

async function callModel(model: string, key: string, system: string, messages: ChatMessage[]) {
  return fetch(`${API}/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.3 },
    }),
  });
}

export async function askModel(system: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your-key-here") {
    throw new Error("GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key.");
  }

  let model = process.env.GEMINI_MODEL || (await pickModel(key));
  let res = await callModel(model, key, system, messages);

  // The chosen model was retired: find a current one and try once more.
  if (res.status === 404) {
    cachedModel = null;
    model = await pickModel(key);
    res = await callModel(model, key, system, messages);
  }

  if (!res.ok) {
    throw new Error(`AI request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
}

import { NextResponse } from "next/server";

// Quick self-check: can this machine reach Google's AI, and how fast?
// Open http://localhost:3000/api/health in the browser. Never shows the API key.

export const dynamic = "force-dynamic";

const API = "https://generativelanguage.googleapis.com/v1beta";

async function timed<T>(fn: () => Promise<T>) {
  const t = Date.now();
  try {
    return { ok: true, value: await fn() };
  } catch (err) {
    const e = err as { name?: string; message?: string; cause?: { code?: string; message?: string } };
    return {
      ok: false,
      ms: Date.now() - t,
      error: `${e?.name ?? "Error"}: ${e?.message ?? ""} ${e?.cause?.code ?? ""} ${e?.cause?.message ?? ""}`.trim(),
    };
  }
}

export async function GET(req: Request) {
  const forced = new URL(req.url).searchParams.get("model");
  const key = process.env.GEMINI_API_KEY;
  const report: Record<string, unknown> = {
    keySet: Boolean(key && key !== "your-key-here"),
    modelOverride: process.env.GEMINI_MODEL || null,
  };
  if (!report.keySet) return NextResponse.json(report);

  const start = Date.now();
  const list = await timed(async () => {
    const res = await fetch(`${API}/models?pageSize=1000`, {
      headers: { "x-goog-api-key": key! },
      signal: AbortSignal.timeout(25_000),
    });
    const body = await res.json();
    const names: string[] = (body.models ?? [])
      .filter((m: { supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: { name: string }) => m.name.replace(/^models\//, ""));
    return { status: res.status, flashModels: names.filter((n) => n.includes("flash")) };
  });
  report.step1_listModels = { ...list, ms: Date.now() - start };

  const model =
    forced ||
    process.env.GEMINI_MODEL ||
    (list.ok
      ? (list.value as { flashModels: string[] }).flashModels
          .filter((n) => /^gemini-[\d.]+-flash$/.test(n))
          .sort((a, b) => parseFloat(b.slice(7)) - parseFloat(a.slice(7)))[0]
      : null);
  report.chosenModel = model;

  if (model) {
    const t = Date.now();
    const gen = await timed(async () => {
      const res = await fetch(`${API}/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key! },
        signal: AbortSignal.timeout(60_000),
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say hi in 3 words." }] }],
          ...(new URL(req.url).searchParams.get("thinking") ? { generationConfig: { thinkingConfig: JSON.parse(new URL(req.url).searchParams.get("thinking")!) } } : {}),
        }),
      });
      const text = await res.text();
      return { status: res.status, body: text.slice(0, 400) };
    });
    report.step2_simpleAnswer = { ...gen, ms: Date.now() - t };
  }

  return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
}

import { NextResponse } from "next/server";
import { loadLegalContext } from "@/lib/legal";
import { buildSystemPrompt } from "@/lib/prompt";
import { askModel, type ChatMessage } from "@/lib/ai";
import { STATES } from "@/lib/areas";

const LANGUAGES: Record<string, string> = {
  en: "English",
  te: "Telugu",
  hi: "Hindi",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { area, state, language = "en", messages } = body as {
      area: string;
      state: string;
      language?: string;
      messages: ChatMessage[];
    };

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
      return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
    }

    const ctx = await loadLegalContext(area, state);
    const stateName = STATES.find((s) => s.code === state)!.name;

    const system = buildSystemPrompt({
      areaTitle: ctx.area.title,
      stateName,
      central: ctx.central,
      state: ctx.state,
      template: ctx.template,
      language: LANGUAGES[language] ?? "English",
    });

    const reply = await askModel(
      system,
      messages.map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
    );
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

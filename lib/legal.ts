import { promises as fs } from "fs";
import path from "path";
import { getArea, STATES } from "./areas";

const ROOT = path.join(process.cwd(), "legal-content");
const TEMPLATES = path.join(process.cwd(), "templates");

// Loads the checked legal rules for one area + one state.
// The AI is only allowed to answer from this text.
export async function loadLegalContext(areaId: string, stateCode: string) {
  const area = getArea(areaId);
  if (!area) throw new Error(`Unknown area: ${areaId}`);
  if (!STATES.some((s) => s.code === stateCode)) {
    throw new Error(`Unknown state: ${stateCode}`);
  }

  const [central, state, template] = await Promise.all([
    fs.readFile(path.join(ROOT, "central", `${area.id}.md`), "utf8"),
    fs.readFile(path.join(ROOT, "states", `${stateCode}.json`), "utf8"),
    fs.readFile(path.join(TEMPLATES, `${area.template}.md`), "utf8"),
  ]);

  return { area, central, state, template };
}

import { Fragment, type ReactNode } from "react";

// A small, safe Markdown renderer for AI replies: headings, lists, bold, italic, links.
// No HTML is ever injected; everything is rendered as React elements.

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={key}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) {
      const label = tok.slice(1, tok.indexOf("]"));
      out.push(
        <a key={key} href={m[2]} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    } else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { type: "h"; level: number; text: string }
  | { type: "p"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] };

function parse(md: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (para.length) blocks.push({ type: "p", lines: para });
    if (list) blocks.push(list);
    para = [];
    list = null;
  };

  for (const raw of md.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    const h = line.match(/^\s*(#{1,6})\s+(.*)$/);
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (!line.trim() || /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flush();
    } else if (h) {
      flush();
      blocks.push({ type: "h", level: h[1].length, text: h[2].replace(/#+\s*$/, "") });
    } else if (ul || ol) {
      const type = ul ? "ul" : "ol";
      if (para.length) {
        blocks.push({ type: "p", lines: para });
        para = [];
      }
      if (!list || list.type !== type) {
        if (list) blocks.push(list);
        list = { type, items: [] };
      }
      list.items.push((ul ?? ol)![1]);
    } else if (list && /^\s{2,}/.test(raw)) {
      list.items[list.items.length - 1] += " " + line.trim(); // continuation of a list item
    } else {
      if (list) {
        blocks.push(list);
        list = null;
      }
      para.push(line.trim());
    }
  }
  flush();
  return blocks;
}

export default function Markdown({ text }: { text: string }) {
  return (
    <div className="md">
      {parse(text).map((b, i) => {
        const k = `b${i}`;
        if (b.type === "h") {
          const Tag = b.level <= 2 ? "h3" : "h4";
          return <Tag key={k}>{inline(b.text, k)}</Tag>;
        }
        if (b.type === "ul" || b.type === "ol") {
          const Tag = b.type;
          return (
            <Tag key={k}>
              {b.items.map((item, j) => (
                <li key={j}>{inline(item, `${k}-${j}`)}</li>
              ))}
            </Tag>
          );
        }
        const lines = (b as { lines: string[] }).lines;
        return (
          <p key={k}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l, `${k}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

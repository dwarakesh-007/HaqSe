"use client";

// Turns a drafted document into a downloadable PDF, right in the browser.
// Note: the built-in PDF font only supports English letters. Telugu/Hindi PDFs
// need a Unicode font added later (see docs/ROADMAP.md).
export async function downloadPdf(text: string, filename = "haqse-document.pdf") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  const lineHeight = 6;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  let y = margin;
  for (const line of doc.splitTextToSize(text, width) as string[]) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }
  doc.save(filename);
}

export function extractDocument(reply: string): { message: string; document?: string } {
  const match = reply.match(/<<<DOCUMENT\s*([\s\S]*?)\s*DOCUMENT>>>/);
  if (!match) return { message: reply };
  return { message: reply.replace(match[0], "").trim(), document: match[1].trim() };
}

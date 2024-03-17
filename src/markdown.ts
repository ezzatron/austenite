export function code(language: string, content: string): string {
  return `\`\`\`${language}
${content}
\`\`\``;
}

export function inlineCode(content: string): string {
  return `\`${content.replaceAll("`", "``")}\``;
}

export function strong(content: string): string {
  return `**${content.replaceAll("*", "\\*")}**`;
}

export function italic(content: string): string {
  return `_${content.replaceAll("_", "\\_")}_`;
}

export function list(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

type Alignment = "left" | "center" | "right";

export function table(
  headers: string[],
  alignments: Alignment[],
  rows: string[][],
): string {
  const widths = headers.map((h, i) =>
    Math.max(3, h.length, ...rows.map((r) => r[i].length)),
  );
  const header = tableRow(widths, headers);
  const separator = tableRow(widths, tableSeparator(widths, alignments));
  const body = rows.map((r) => tableRow(widths, r)).join("\n");

  return `${header}\n${separator}\n${body}`;
}

function tableSeparator(widths: number[], alignments: Alignment[]): string[] {
  return alignments.map((a, i) => tableAlign(a, widths[i]));
}

function tableAlign(align: Alignment, width: number): string {
  switch (align) {
    case "left":
      return ":" + "-".repeat(width - 1);
    case "right":
      return "-".repeat(width - 1) + ":";
  }

  return ":" + "-".repeat(width - 2) + ":";
}

function tableRow(widths: number[], row: string[]): string {
  return `| ${row.map((c, i) => c.padEnd(widths[i])).join(" | ")} |`;
}

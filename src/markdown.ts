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

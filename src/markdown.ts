import { fromMarkdown } from "mdast-util-from-markdown";

export function markdownToContentArray<T>(markdown: string): T[] {
  return fromMarkdown(markdown).children as T[];
}

export function markdownToContent<T>(markdown: string): T {
  const content = markdownToContentArray<T>(markdown);

  return content[0];
}

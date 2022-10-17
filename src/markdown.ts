import { fromMarkdown } from "mdast-util-from-markdown";

export function toContentArray<T>(markdown: string): T[] {
  return fromMarkdown(markdown).children as T[];
}

export function toContent<T>(markdown: string): T {
  const content = toContentArray<T>(markdown);

  return content[0];
}

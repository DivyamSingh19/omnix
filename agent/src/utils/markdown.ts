export function cleanMarkdown(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s*/gm, "")
    .replace(/\\n|\\r|\\t/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\r+/g, " ")
    .replace(/\s*\|\s*/g, " ")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\s\s+/g, " ")
    .trim();
}

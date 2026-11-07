import { marked } from 'marked';

// Configure marked with sensible defaults
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Normalizes text to ensure all types of point formats (unicode bullets •, ◦, ▪, etc.)
 * are converted to standard markdown list syntax (- ) and that lists are cleanly
 * separated from previous paragraph blocks so marked converts them reliably to <ul>/<ol>.
 */
export function normalizeMarkdownPoints(content) {
  if (!content || typeof content !== 'string') return '';

  // 1. Convert unicode bullets (•, ◦, ▪, ・) at line starts to standard markdown hyphen
  let normalized = content.replace(/^([ \t]*)[•◦▪・]\s*/gm, '$1- ');

  // 2. Ensure list items immediately following regular text have a blank line before them
  // so markdown parsers strictly parse them as lists rather than inline text
  normalized = normalized.replace(/(^[ \t]*[^-\n*+\d#>\s].*)\n([ \t]*(?:[-*+]|\d+\.)\s)/gm, '$1\n\n$2');

  return normalized;
}

/**
 * Parses markdown safely with point normalization
 */
export function parseMarkdown(content) {
  if (!content) return '';
  const str = Array.isArray(content) ? content.join('\n\n') : String(content);
  return marked.parse(normalizeMarkdownPoints(str));
}

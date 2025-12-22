/**
 * A heuristic helper to split text into pages.
 * Real DOM pagination is complex; this approximates based on char count and line breaks.
 */
export const paginateText = (text: string, fontSize: number, maxLinesPerPage: number = 12): string[] => {
  const lines = text.split('\n');
  const pages: string[] = [];
  let currentLines: string[] = [];
  let currentLineCount = 0;

  // Approximate chars per line based on font size (assuming container width ~320px)
  // Base font 16px ~= 20 chars per line roughly for CJK/English mix
  const charsPerLine = Math.floor(320 / fontSize * 1.8); 

  lines.forEach((line) => {
    // Calculate how many visual lines this text line consumes
    const visualLines = Math.max(1, Math.ceil(line.length / charsPerLine));
    
    // If adding this line exceeds the page limit
    if (currentLineCount + visualLines > maxLinesPerPage && currentLines.length > 0) {
      pages.push(currentLines.join('\n'));
      currentLines = [line];
      currentLineCount = visualLines;
    } else {
      currentLines.push(line);
      currentLineCount += visualLines;
    }
  });

  if (currentLines.length > 0) {
    pages.push(currentLines.join('\n'));
  }

  return pages;
};

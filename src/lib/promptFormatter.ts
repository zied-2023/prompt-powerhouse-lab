/**
 * Utilities for cleaning and formatting prompts
 */

/**
 * Remove excessive formatting like multiple asterisks and extra spaces
 */
export function cleanExcessiveFormatting(text: string): string {
  let cleaned = text;

  // Remove excessive asterisks (more than 2 in a row)
  cleaned = cleaned.replace(/\*{3,}/g, '**');

  // Remove excessive whitespace at the beginning/end of lines
  cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');

  // Reduce multiple blank lines to maximum 2
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing blank lines
  cleaned = cleaned.trim();

  return cleaned;
}

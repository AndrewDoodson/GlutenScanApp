export function parseIngredients(rawIngredients: string): string[] {
  if (!rawIngredients) return [];

  return rawIngredients
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\d+(\.\d+)?%/g, ' ')
    .replace(/[;|]/g, ',')
    .replace(/[^a-z0-9,\s\-']/g, ' ')
    .split(',')
    .map(item => item.trim().replace(/\s+/g, ' '))
    .filter(item => item.length > 1);
}

export function normaliseText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
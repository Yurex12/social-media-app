export function generateUsername(name: string, attempt: number): string {
  const clean = name
    .replace(/[^a-zA-Z0-9_ ]/g, '')
    .toLowerCase()
    .trim();
  const parts = clean.split(/\s+/).filter(Boolean);

  const base1 = parts[0] || '';
  const base2 = parts[1] || '';

  const chars = '0123456789_';
  const maxLen = 15;

  function truncate(str: string, extra: number = 0) {
    return str.slice(0, maxLen - extra);
  }

  function randomSuffix(len: number) {
    return Array.from({ length: len }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  // Case 1: two-part name
  if (parts.length >= 2) {
    if (attempt === 0) return truncate(base1 + base2);
    if (attempt === 1) return truncate(base2 + base1);
    if (attempt === 2) return truncate(base2);
    if (attempt === 3) return truncate(base1);

    // attempt >= 4
    const bases = [base1, base2, `${base1}_${base2}`, `${base2}_${base1}`];
    const pick = truncate(bases[Math.floor(Math.random() * bases.length)], 2);
    return pick + randomSuffix(Math.min(2, attempt));
  }

  // Case 2: single-part name (>=4 chars)
  if (base1.length >= 4) {
    if (attempt === 0) return truncate(base1);
    if (attempt === 1) return truncate(base1, 1) + randomSuffix(1);
    return truncate(base1, 2) + randomSuffix(Math.min(2, attempt));
  }

  // Case 3: short name (2–3 chars)
  if (base1.length >= 2) {
    return truncate(base1, 3) + randomSuffix(3);
  }

  // Case 4: invalid (<2 chars)
  return randomSuffix(4);
}

export function generateSuggestions(name: string): string[] {
  const clean = name
    .replace(/[^a-zA-Z0-9_ ]/g, '')
    .toLowerCase()
    .trim();
  const parts = clean.split(/\s+/).filter(Boolean);

  const base1 = parts[0] || '';
  const base2 = parts[1] || '';
  const chars = '0123456789_';
  const maxLen = 15;

  function randomSuffix(len: number) {
    return Array.from({ length: len }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  function truncate(str: string, extra: number = 0) {
    return str.slice(0, maxLen - extra);
  }

  const suggestions: string[] = [];

  if (parts.length >= 2) {
    // Two-part name
    suggestions.push(truncate(base1, 1) + randomSuffix(1));
    suggestions.push(truncate(base2, 1) + randomSuffix(1));
    const combos = [base1 + base2, base2 + base1, `${base1}_${base2}`];
    const pick = combos[Math.floor(Math.random() * combos.length)];
    suggestions.push(truncate(pick, 2) + randomSuffix(2)); // combo
  } else if (base1.length >= 5) {
    // Single-part name >= 5 chars
    suggestions.push(truncate(base1, 1) + randomSuffix(1));
    suggestions.push(truncate(base1, 2) + randomSuffix(2));
    suggestions.push(truncate(base1, 2) + randomSuffix(2));
  } else if (base1.length >= 2) {
    // Short name (2–4 chars)
    suggestions.push(truncate(base1, 3) + randomSuffix(3));
    suggestions.push(truncate(base1, 3) + randomSuffix(3));
    suggestions.push(truncate(base1, 3) + randomSuffix(3));
  } else {
    // Fallback for invalid names
    suggestions.push(randomSuffix(4));
    suggestions.push(randomSuffix(4));
    suggestions.push(randomSuffix(4));
  }

  return suggestions;
}

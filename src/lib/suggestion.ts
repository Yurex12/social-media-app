import { MAX_USERNAME_LENGTH } from '@/constants';

export function generateSuggestions(name: string): string[] {
  const clean = name
    .replace(/[^a-zA-Z0-9_ ]/g, '')
    .toLowerCase()
    .trim();
  const [base1 = '', base2 = ''] = clean.split(/\s+/).filter(Boolean);

  const rnd = (len: number) =>
    Array.from(
      { length: len },
      () => '0123456789_'[Math.floor(Math.random() * 11)]
    ).join('');

  const suggestions: string[] = [];

  if (base2) {
    // Two-part name logic
    suggestions.push(base1.slice(0, MAX_USERNAME_LENGTH - 1) + rnd(1));
    suggestions.push(base2.slice(0, MAX_USERNAME_LENGTH - 1) + rnd(1));
    const combo = [base1 + base2, base2 + base1, `${base1}_${base2}`][
      Math.floor(Math.random() * 3)
    ];
    suggestions.push(combo.slice(0, MAX_USERNAME_LENGTH - 2) + rnd(2));
  } else if (base1.length >= 5) {
    // Single name >= 5 chars
    suggestions.push(base1.slice(0, MAX_USERNAME_LENGTH - 1) + rnd(1));
    suggestions.push(base1.slice(0, MAX_USERNAME_LENGTH - 2) + rnd(2));
    suggestions.push(base1.slice(0, MAX_USERNAME_LENGTH - 2) + rnd(2));
  } else {
    // Short name or fallback (random suffix 3 or 4)
    const len = base1.length >= 2 ? 3 : 4;
    const base = base1.slice(0, MAX_USERNAME_LENGTH - len);
    suggestions.push(base + rnd(len), base + rnd(len), base + rnd(len));
  }
  return suggestions;
}

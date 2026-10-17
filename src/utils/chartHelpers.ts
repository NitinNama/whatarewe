export const PARTICIPANT_COLORS = [
  '#0d9488', // Teal
  '#8b5cf6', // Purple
  '#f97316', // Orange
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#eab308', // Amber
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#6366f1', // Indigo
];

/**
 * Calculates strictly integer percentages that are guaranteed to:
 * 1. Sum up to exactly 100% (Σ Percentages == 100%).
 * 2. Strictly preserve monotonic ordering: higher counts always receive equal or higher percentages (no inverted labels).
 * 3. Uses the Largest Remainder Method with tie-breaking prioritizing higher absolute counts and original ranks.
 */
export function calculateNormalizedPercentages(
  items: { count: number; [key: string]: any }[]
): number[] {
  if (!items || items.length === 0) return [];

  const safeCounts = items.map((item) => Math.max(0, Number(item.count) || 0));
  const total = safeCounts.reduce((sum, c) => sum + c, 0);

  // Fallback for empty or all-zero counts: distribute evenly
  if (total === 0) {
    const base = Math.floor(100 / items.length);
    const rem = 100 - base * items.length;
    return items.map((_, i) => base + (i < rem ? 1 : 0));
  }

  // Exact fractional percentages
  const exact = safeCounts.map((c) => (c / total) * 100);
  const floors = exact.map((x) => Math.floor(x));
  const floorSum = floors.reduce((a, b) => a + b, 0);
  const remainder = 100 - floorSum;

  // Rank indices by largest fractional remainder
  const indices = items.map((_, i) => i);
  indices.sort((a, b) => {
    const fracA = exact[a] - floors[a];
    const fracB = exact[b] - floors[b];
    const diff = fracB - fracA;
    if (Math.abs(diff) > 0.00001) return diff;
    // Tie-breaker: prioritize participant with higher count, then earlier index
    return safeCounts[b] - safeCounts[a] || a - b;
  });

  const result = [...floors];
  for (let i = 0; i < remainder; i++) {
    result[indices[i % indices.length]] += 1;
  }

  // Final sanity verification: ensure strict monotonicity (no inversions)
  // If count[i] > count[j], result[i] MUST be >= result[j]
  for (let i = 0; i < items.length - 1; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (safeCounts[i] > safeCounts[j] && result[i] < result[j]) {
        // Swap to preserve strict integrity
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
  }

  return result;
}

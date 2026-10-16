/** Explicit serialisable Mulberry32 state; no ambient randomness or clock. */
export function random(rng: number): {value: number; rng: number} {
  const next = (rng + 0x6D2B79F5) >>> 0;
  let t = Math.imul(next ^ (next >>> 15), next | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return {value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, rng: next};
}
export function validateSeed(seed: number) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Seed must be a uint32');
}

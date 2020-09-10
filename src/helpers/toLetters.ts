export function toLetters(num: number): string {
  const mod = num % 26;
  let pow = Math.floor(num / 26 || 0);
  const out = mod ? String.fromCharCode(64 + mod) : ((pow -= 1), 'Z');
  return pow ? toLetters(pow) + out : out;
}

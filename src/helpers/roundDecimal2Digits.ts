export function roundDecimal2Digits(num: number): number {
  if (num) {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }
  return 0;
}

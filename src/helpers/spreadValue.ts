export const spreadValue = (toSpread: number | string): string =>
  String(toSpread).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');

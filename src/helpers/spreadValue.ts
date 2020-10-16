export const spreadValue = (toSpread: number): string =>
  String(toSpread).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');

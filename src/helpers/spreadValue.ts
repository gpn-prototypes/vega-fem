export const spreadValue = (toSpread: number | string): string =>
  String(toSpread).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');

export const prepareStringForBack = (value: string): number => +value.replace(/ /g, '');

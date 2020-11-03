export const spreadValue = (toSpread: number | string): string => {
  const toSpreadStr = String(toSpread);

  let match = toSpreadStr.match(/\d+[.|,]/g);
  const remains = toSpreadStr.match(/[.|,]\d+/g);
  if (match) {
    match = match[0].split('');
    match.pop();
    return `${match.join('').replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')}${
      remains ? remains[0] : ''
    }`;
  }

  return toSpreadStr.replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
};

export const prepareStringForBack = (value: string): number => {
  const replaced = value.replace(/ /g, '');
  return +replaced;
};

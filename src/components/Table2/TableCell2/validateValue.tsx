export const validateValue = (cellValue: string | number): string => {
  const str = String(cellValue);
  if (cellValue && str.match(/,|\./g)) {
    const splitted = str.split(/[,|.]/g).filter((v) => v);
    const ending = splitted[splitted.length - 1];
    splitted.pop();
    return `${splitted.join('')}.${ending}`;
  }

  return `${cellValue}`;
};

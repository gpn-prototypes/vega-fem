export const validateValue = (cellValue: string | number): string => {
  let str = String(cellValue);
  str = str.replace(/ /g, '');
  if (cellValue && str.match(/,|\./g)) {
    const splitted = str.split(/[,|.]/g).filter((v) => v);
    const ending = splitted[splitted.length - 1];
    splitted.pop();
    return splitted.length ? `${splitted.join('')}.${ending}` : ending;
  }

  return str;
};

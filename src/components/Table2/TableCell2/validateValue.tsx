export const validateValue = (cellValue: string): string => {
  const arr = cellValue.split('');
  let index = null;
  let count = arr.length;
  const match = cellValue.match(/\.|,/gm);

  if (match && match.length) {
    while (count) {
      index = index === null && arr[count] === '.' ? count : index;
      if (arr[count]?.match(/\.|,/) && index !== count) arr[count] = '';
      count -= 1;
    }
  }
  if (index) arr[index] = '.';

  // if (arr[arr.length - 1] === '.') {
  //   arr.pop();
  //   return arr.join('');
  // }
  console.log(arr.join(''), 'CELL2');

  return arr.join('');
};

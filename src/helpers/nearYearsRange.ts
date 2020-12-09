import SelectOptions from '@/types/SelectOptions';

/* return [currentYear - from, ... , currentYear + to]
 *  */
const nearYearsRange = (from: number, to: number): number[] => {
  const currentYear = new Date().getFullYear();
  const length: number = to + from + 1;
  return [...Array(length)].map((year, index) => currentYear - from + index);
};

const yearsRangeOptions = (from: number, to: number): SelectOptions[] =>
  nearYearsRange(from, to).map(
    (year): SelectOptions => {
      return { value: year.toString(), label: year.toString() };
    },
  );

export { nearYearsRange, yearsRangeOptions };

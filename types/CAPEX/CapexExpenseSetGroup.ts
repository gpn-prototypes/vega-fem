import Article from '../Article';

export default interface CapexExpenseSetGroup {
  id?: string | number;
  name?: string;
  caption?: string;
  valueTotal?: number;
  capexExpenseList?: Article[];
}

export default interface CapexExpense {
  id?: string | number;
  name?: string;
  caption?: string;
  valueTotal?: number;
  value?: CapexExpenseValues[];
  unit?: string;
}

export interface CapexExpenseValues {
  year?: number;
  value: number;
}

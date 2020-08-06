export default interface Macroparameter {
  id?: string | number;
  name?: string;
  caption?: string;
  value?: MacroparameterValues[] | number;
  valueTotal?: number;
  unit?: string;
}

export interface MacroparameterValues {
  year?: number;
  value: number;
}

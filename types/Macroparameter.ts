export default interface Macroparameter {
  id?: string | number;
  name?: string;
  caption?: string;
  value?: MacroparameterValues[];
  unit?: string;
}

export interface MacroparameterValues {
  year: number;
  value: number;
}

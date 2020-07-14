export default interface Macroparameter {
  id?: string | number;
  name?: string;
  caption?: string;
  value?: MacroparameterValues[];
}

export interface MacroparameterValues {
  year: number;
  value: number;
}

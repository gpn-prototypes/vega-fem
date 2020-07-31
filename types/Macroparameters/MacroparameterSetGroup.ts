import Macroparameter from './Macroparameter';

export default interface MacroparameterSetGroup {
  id?: string | number;
  name?: string;
  caption?: string;
  macroparameterList?: Macroparameter[];
}

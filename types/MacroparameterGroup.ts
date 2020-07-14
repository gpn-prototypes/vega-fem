import Macroparameter from './Macroparameter';

export default interface MacroparameterGroup {
  id?: string | number;
  name?: string;
  caption?: string;
  macroparameterList?: Macroparameter[];
}

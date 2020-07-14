import MacroparameterGroup from './MacroparameterGroup';

// interface for scenarios of macroparams
export default interface MacroparameterSet {
  id?: string | number;
  name?: string;
  caption?: string;
  years?: number;
  category?: string;
  macroparameterGroupList?: MacroparameterGroup[];
}

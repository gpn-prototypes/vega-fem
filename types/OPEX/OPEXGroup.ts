import Macroparameter from '../Macroparameters/Macroparameter';

// interface of OPEXPresetGroup: autoexport or mkos
export interface OPEXPresetGroup {
  yearStart: number;
  yearEnd: number;
  opexExpenseList: Macroparameter[];
}

export interface OPEXGroup extends OPEXPresetGroup {
  id?: string;
  name?: string;
  caption?: string;
}

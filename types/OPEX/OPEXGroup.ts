// interface of OPEXPresetGroup: autoexport or mkos
import Article from '../Article';

export interface OPEXPresetGroup {
  yearStart: number;
  yearEnd: number;
  opexExpenseList: Article[];
}

export interface OPEXGroup extends OPEXPresetGroup {
  id?: string;
  name?: string;
  caption?: string;
}

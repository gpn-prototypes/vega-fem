import { OPEXGroup, OPEXPresetGroup } from './OPEXGroup';

// interface of OPEX
export default interface OPEXSet {
  sdf: boolean;
  hasAutoexport: boolean;
  autoexport?: OPEXPresetGroup;
  hasMkos: boolean;
  mkos?: OPEXPresetGroup;
  opexCaseList?: OPEXGroup[];
}

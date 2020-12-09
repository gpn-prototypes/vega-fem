import { OPEXGroup, OPEXPresetGroup } from './OPEXGroup';

// interface of OPEX
export default interface OPEXSetType {
  sdf: boolean;
  hasAutoexport: boolean;
  autoexport?: OPEXPresetGroup;
  hasMkos: boolean;
  mkos?: OPEXPresetGroup;
  opexCaseList?: OPEXGroup[];
}

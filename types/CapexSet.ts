import CapexExpenseSetGroup from './CapexExpenseSetGroup';
import CapexSetGlobalValue from './CapexSetGlobalValue';

// interface for scenarios of capex
export default interface CapexSet {
  years?: number;
  yearStart?: number;
  capexGlobalValueList?: CapexSetGlobalValue[];
  capexExpenseGroupList?: CapexExpenseSetGroup[];
}

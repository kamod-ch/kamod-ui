import { BulkActionBar } from "./BulkActionBar";
import { BulkActionBarActions } from "./BulkActionBarActions";
import { BulkActionBarClear } from "./BulkActionBarClear";
import { BulkActionBarCount } from "./BulkActionBarCount";
import {
  bulkActionBar,
  bulkActionBarActions,
  bulkActionBarClear,
  bulkActionBarCount,
} from "./bulk-action-bar-variants";

const BulkActionBarVariants = {
  bulkActionBar,
  bulkActionBarCount,
  bulkActionBarActions,
  bulkActionBarClear,
};

export type { BulkActionBarProps, BulkActionBarVariant } from "./BulkActionBar";

export type { BulkActionBarActionsProps } from "./BulkActionBarActions";
export type { BulkActionBarClearProps } from "./BulkActionBarClear";
export type { BulkActionBarCountProps } from "./BulkActionBarCount";
export { useBulkActionBar } from "./bulk-action-bar-context";
export {
  BulkActionBar,
  BulkActionBarActions,
  BulkActionBarClear,
  BulkActionBarCount,
  BulkActionBarVariants,
  bulkActionBar,
  bulkActionBarActions,
  bulkActionBarClear,
  bulkActionBarCount,
};

export default {
  Root: BulkActionBar,
  Count: BulkActionBarCount,
  Actions: BulkActionBarActions,
  Clear: BulkActionBarClear,
};

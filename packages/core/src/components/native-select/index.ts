import { NativeSelect, nativeSelect, nativeSelectIcon, nativeSelectWrapper } from "./NativeSelect";
import { NativeSelectOptGroup } from "./NativeSelectOptGroup";
import { NativeSelectOption } from "./NativeSelectOption";

const NativeSelectVariants = {
  nativeSelect,
  nativeSelectIcon,
  nativeSelectWrapper
};

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption, NativeSelectVariants };

export default {
  Root: NativeSelect,
  Option: NativeSelectOption,
  OptGroup: NativeSelectOptGroup
};


import { InputGroup, inputGroup } from "./InputGroup";
import { InputGroupAddon, inputGroupAddon } from "./InputGroupAddon";
import { InputGroupButton, inputGroupButton } from "./InputGroupButton";
import { InputGroupInput, inputGroupInput } from "./InputGroupInput";
import { InputGroupText } from "./InputGroupText";
import { InputGroupTextarea, inputGroupTextarea } from "./InputGroupTextarea";

const InputGroupVariants = {
  inputGroup,
  inputGroupAddon,
  inputGroupButton,
  inputGroupInput,
  inputGroupTextarea
};

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  InputGroupVariants
};

export default {
  Root: InputGroup,
  Addon: InputGroupAddon,
  Button: InputGroupButton,
  Input: InputGroupInput,
  Text: InputGroupText,
  Textarea: InputGroupTextarea
};


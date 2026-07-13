import { createKamodOpenUILibrary } from "../library/createLibrary";

/** Form-focused preset with supporting layout and feedback components. */
export const formsPreset = createKamodOpenUILibrary({
  components: {
    tabs: false,
    accordion: false,
    grid: false,
    progress: false,
    skeleton: false,
  },
  root: "Form",
});

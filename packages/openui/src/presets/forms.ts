import { createKamodOpenUILibrary, type KamodOpenUILibrary } from "../library/createLibrary.js";

/** Form-focused preset with supporting layout and feedback components. */
export const formsPreset: KamodOpenUILibrary = createKamodOpenUILibrary({
  components: {
    tabs: false,
    accordion: false,
    grid: false,
    progress: false,
    skeleton: false,
  },
  root: "Form",
});

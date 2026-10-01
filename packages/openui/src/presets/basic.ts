import { createKamodOpenUILibrary, type KamodOpenUILibrary } from "../library/createLibrary.js";

/** Layout, content, feedback, and basic actions — no forms. */
export const basicPreset: KamodOpenUILibrary = createKamodOpenUILibrary({
  components: {
    form: false,
    field: false,
    input: false,
    textarea: false,
    select: false,
    checkbox: false,
    switch: false,
    submitButton: false,
  },
  root: "Stack",
});

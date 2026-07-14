import { createKamodOpenUILibrary } from "../library/createLibrary";

/** Layout, content, feedback, and basic actions — no forms. */
export const basicPreset = createKamodOpenUILibrary({
  components: {
    form: false,
    field: false,
    input: false,
    textarea: false,
    select: false,
    checkbox: false,
    switch: false,
    submitButton: false,
    radioGroup: false,
    datePicker: false,
    combobox: false,
    richSelect: false,
    slider: false,
    inputOtp: false,
    inputGroup: false,
    selectableCard: false,
  },
  root: "Stack",
});

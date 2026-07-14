import { createKamodOpenUILibrary } from "../library/createLibrary";

/**
 * Dashboard-style preset: layouts, tables, navigation, and feedback — forms disabled.
 * Dropzone and Direction remain excluded from the OpenUI adapter entirely.
 */
export const dashboardPreset = createKamodOpenUILibrary({
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

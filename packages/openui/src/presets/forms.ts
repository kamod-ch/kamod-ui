import { createKamodOpenUILibrary } from "../library/createLibrary";

/** Form-focused preset with supporting layout and feedback components. */
export const formsPreset = createKamodOpenUILibrary({
  components: {
    tabs: false,
    accordion: false,
    grid: false,
    progress: false,
    skeleton: false,
    dialog: false,
    alertDialog: false,
    drawer: false,
    sheet: false,
    sidebar: false,
    command: false,
    menubar: false,
    contextMenu: false,
    navigationMenu: false,
  },
  root: "Form",
});

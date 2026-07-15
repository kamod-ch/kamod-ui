import type { AuthBlockId } from "@kamod-ch/blocks";
import authCover from "../../../blocks/src/auth/shared/auth-cover.svg?raw";
import authUtils from "../../../blocks/src/auth/shared/auth-utils.ts?raw";
import login01Form from "../../../blocks/src/login/login-01/login-form.tsx?raw";
import login01Page from "../../../blocks/src/login/login-01/page.tsx?raw";
import login02Form from "../../../blocks/src/login/login-02/login-form.tsx?raw";
import login02Page from "../../../blocks/src/login/login-02/page.tsx?raw";
import login03Form from "../../../blocks/src/login/login-03/login-form.tsx?raw";
import login03Page from "../../../blocks/src/login/login-03/page.tsx?raw";
import login04Form from "../../../blocks/src/login/login-04/login-form.tsx?raw";
import login04Page from "../../../blocks/src/login/login-04/page.tsx?raw";
import login05Form from "../../../blocks/src/login/login-05/login-form.tsx?raw";
import login05Page from "../../../blocks/src/login/login-05/page.tsx?raw";
import signup01Page from "../../../blocks/src/signup/signup-01/page.tsx?raw";
import signup01Form from "../../../blocks/src/signup/signup-01/signup-form.tsx?raw";
import signup02Page from "../../../blocks/src/signup/signup-02/page.tsx?raw";
import signup02Form from "../../../blocks/src/signup/signup-02/signup-form.tsx?raw";
import signup03Page from "../../../blocks/src/signup/signup-03/page.tsx?raw";
import signup03Form from "../../../blocks/src/signup/signup-03/signup-form.tsx?raw";
import signup04Page from "../../../blocks/src/signup/signup-04/page.tsx?raw";
import signup04Form from "../../../blocks/src/signup/signup-04/signup-form.tsx?raw";
import signup05Page from "../../../blocks/src/signup/signup-05/page.tsx?raw";
import signup05Form from "../../../blocks/src/signup/signup-05/signup-form.tsx?raw";

const sources: Record<AuthBlockId, Record<string, string>> = {
  "login-01": { "app/login/page.tsx": login01Page, "components/login-form.tsx": login01Form },
  "login-02": {
    "app/login/page.tsx": login02Page,
    "components/login-form.tsx": login02Form,
    "assets/auth-cover.svg": authCover,
  },
  "login-03": { "app/login/page.tsx": login03Page, "components/login-form.tsx": login03Form },
  "login-04": {
    "app/login/page.tsx": login04Page,
    "components/login-form.tsx": login04Form,
    "assets/auth-cover.svg": authCover,
  },
  "login-05": { "app/login/page.tsx": login05Page, "components/login-form.tsx": login05Form },
  "signup-01": { "app/signup/page.tsx": signup01Page, "components/signup-form.tsx": signup01Form },
  "signup-02": {
    "app/signup/page.tsx": signup02Page,
    "components/signup-form.tsx": signup02Form,
    "assets/auth-cover.svg": authCover,
  },
  "signup-03": { "app/signup/page.tsx": signup03Page, "components/signup-form.tsx": signup03Form },
  "signup-04": {
    "app/signup/page.tsx": signup04Page,
    "components/signup-form.tsx": signup04Form,
    "assets/auth-cover.svg": authCover,
  },
  "signup-05": { "app/signup/page.tsx": signup05Page, "components/signup-form.tsx": signup05Form },
};

export const getAuthBlockSource = (id: AuthBlockId, fileLabel: string): string => {
  if (fileLabel === "lib/auth-utils.ts") return authUtils;
  return sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
};

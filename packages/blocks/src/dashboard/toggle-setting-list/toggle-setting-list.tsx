import { Label, Switch } from "@kamod-ch/ui";
import { useControllableState } from "../../shared";
import { DashboardSection } from "../shared/section-card";

export type ToggleSetting = {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
};

export type ToggleSettingListProps = {
  title?: string;
  description?: string;
  settings?: ToggleSetting[];
  value?: Record<string, boolean>;
  defaultValue?: Record<string, boolean>;
  onValueChange?: (value: Record<string, boolean>) => void;
};

const defaultSettings: ToggleSetting[] = [
  {
    id: "weekly-digest",
    label: "Weekly digest",
    description: "A Monday summary of activity in your workspaces.",
    defaultChecked: true,
  },
  {
    id: "product-updates",
    label: "Product updates",
    description: "New features, changelog notes, and previews.",
    defaultChecked: true,
  },
  {
    id: "marketing",
    label: "Marketing emails",
    description: "Occasional offers. We will never sell your address.",
    defaultChecked: false,
  },
  {
    id: "security-alerts",
    label: "Security alerts",
    description: "Sign-in from a new device and recovery-code changes.",
    defaultChecked: true,
  },
];

const defaultsFromSettings = (settings: ToggleSetting[]): Record<string, boolean> =>
  Object.fromEntries(settings.map((setting) => [setting.id, setting.defaultChecked ?? false]));

export const ToggleSettingList = ({
  title = "Notification preferences",
  description = "Choose what we send. Transactional mail is always on.",
  settings = defaultSettings,
  value,
  defaultValue,
  onValueChange,
}: ToggleSettingListProps) => {
  const [current, setCurrent] = useControllableState<Record<string, boolean>>({
    value,
    defaultValue: defaultValue ?? defaultsFromSettings(settings),
    onChange: onValueChange,
  });

  const setSetting = (id: string, next: boolean) => {
    setCurrent({ ...current, [id]: next });
  };

  return (
    <DashboardSection slot="block-toggle-setting-list" title={title} description={description}>
      <ul class="grid gap-4">
        {settings.map((setting) => {
          const switchId = `toggle-setting-${setting.id}`;
          const descriptionId = setting.description ? `${switchId}-description` : undefined;
          const checked = current[setting.id] ?? setting.defaultChecked ?? false;
          return (
            <li key={setting.id} class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <Label for={switchId}>{setting.label}</Label>
                {setting.description ? (
                  <p id={descriptionId} class="text-muted-foreground text-sm">
                    {setting.description}
                  </p>
                ) : null}
              </div>
              <Switch
                id={switchId}
                checked={checked}
                aria-describedby={descriptionId}
                onCheckedChange={(next) => setSetting(setting.id, next)}
              />
            </li>
          );
        })}
      </ul>
    </DashboardSection>
  );
};

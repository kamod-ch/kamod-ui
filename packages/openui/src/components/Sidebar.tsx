import { Button } from "@kamod-ch/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@kamod-ch/ui/sidebar";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";
import { validateNavigationTarget } from "../security/navigation";

const sidebarItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  href: z.string().max(200).optional(),
  action: optionalActionSchema,
});

export const sidebarComponent = defineComponent({
  name: "Sidebar",
  description:
    "Flat sidebar nav. Args: optional headerTitle, items [{label, href?, action?}] max 30, optional footerText. Hrefs are validated; actions fire via host trigger.",
  props: z.object({
    headerTitle: z.string().max(MAX_LABEL_LENGTH).optional(),
    items: z.array(sidebarItemSchema).min(1).max(30),
    footerText: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <SidebarProvider defaultOpen>
        <Sidebar data-slot="openui-sidebar">
          {props.headerTitle ? (
            <SidebarHeader>
              <div class="px-2 py-1.5 text-sm font-semibold">{props.headerTitle}</div>
            </SidebarHeader>
          ) : null}
          <SidebarContent>
            <nav class="flex flex-col gap-1 p-2">
              {props.items.map((item, index) => {
                const decision = item.href ? validateNavigationTarget(item.href) : null;
                if (decision?.allowed) {
                  return (
                    <Button
                      key={`${item.label}-${index}`}
                      variant="ghost"
                      class="justify-start"
                      href={decision.href}
                    >
                      {item.label}
                    </Button>
                  );
                }
                return (
                  <Button
                    key={`${item.label}-${index}`}
                    type="button"
                    variant="ghost"
                    class="justify-start"
                    onClick={() => fireOpenUIAction(triggerAction, item.label, item.action)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </SidebarContent>
          {props.footerText ? (
            <SidebarFooter>
              <p class="px-2 py-1.5 text-xs text-muted-foreground">{props.footerText}</p>
            </SidebarFooter>
          ) : null}
        </Sidebar>
      </SidebarProvider>
    );
  },
});

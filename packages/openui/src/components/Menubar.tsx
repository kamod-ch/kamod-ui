import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@kamod-ch/ui/menubar";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { Fragment } from "preact";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";

const menuItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  action: optionalActionSchema,
  separator: z.boolean().default(false),
});

const menuSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  items: z.array(menuItemSchema).min(1).max(20),
});

export const menubarComponent = defineComponent({
  name: "Menubar",
  description:
    "Application menubar. Args: menus [{label, items: [{label, action?, separator?}]}] max 8. Items fire host actions.",
  props: z.object({
    menus: z.array(menuSchema).min(1).max(8),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <Menubar>
        {props.menus.map((menu, menuIndex) => (
          <MenubarMenu key={`${menu.label}-${menuIndex}`} value={`menu-${menuIndex}`}>
            <MenubarTrigger>{menu.label}</MenubarTrigger>
            <MenubarContent>
              {menu.items.map((item, itemIndex) => (
                <Fragment key={`${item.label}-${itemIndex}`}>
                  {item.separator ? <MenubarSeparator /> : null}
                  <MenubarItem
                    onClick={() => fireOpenUIAction(triggerAction, item.label, item.action)}
                  >
                    {item.label}
                  </MenubarItem>
                </Fragment>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    );
  },
});

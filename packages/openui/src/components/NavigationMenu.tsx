import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@kamod-ch/ui/navigation-menu";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { validateNavigationTarget } from "../security/navigation";

const childLinkSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  href: z.string().max(200).optional(),
});

const navItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  href: z.string().max(200).optional(),
  children: z.array(childLinkSchema).max(12).optional(),
});

function SafeLink({ label, href }: { label: string; href?: string }) {
  if (!href) {
    return <span class="px-3 py-2 text-sm text-muted-foreground">{label}</span>;
  }
  const decision = validateNavigationTarget(href);
  if (!decision.allowed) {
    return (
      <span class="px-3 py-2 text-sm text-muted-foreground" title={decision.reason}>
        {label}
      </span>
    );
  }
  return <NavigationMenuLink href={decision.href}>{label}</NavigationMenuLink>;
}

export const navigationMenuComponent = defineComponent({
  name: "NavigationMenu",
  description:
    "Top navigation. Args: items [{label, href?, children?: [{label, href}]}] max 12. All hrefs are validated against the host navigation policy.",
  props: z.object({
    items: z.array(navItemSchema).min(1).max(12),
  }),
  component: ({ props }) => (
    <NavigationMenu>
      <NavigationMenuList>
        {props.items.map((item, index) => {
          const hasChildren = Boolean(item.children && item.children.length > 0);
          return (
            <NavigationMenuItem key={`${item.label}-${index}`} value={`nav-${index}`}>
              {hasChildren ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul class="grid gap-1">
                      {item.children!.map((child, childIndex) => (
                        <li key={`${child.label}-${childIndex}`}>
                          <SafeLink label={child.label} href={child.href} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <SafeLink label={item.label} href={item.href} />
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  ),
});

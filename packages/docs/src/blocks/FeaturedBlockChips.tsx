import { withBasePath } from "../base-path";

export type FeaturedBlockCategory =
  | "sidebar"
  | "app-sidebar"
  | "login"
  | "signup"
  | "auth"
  | "marketing"
  | "dashboard"
  | "communication"
  | "commerce";

const categories: { id: FeaturedBlockCategory; label: string; href: string }[] = [
  { id: "sidebar", label: "Sidebar", href: "/blocks/sidebar" },
  { id: "app-sidebar", label: "App Sidebar", href: "/blocks/app-sidebar" },
  { id: "login", label: "Login", href: "/blocks/login" },
  { id: "signup", label: "Signup", href: "/blocks/signup" },
  { id: "auth", label: "Auth", href: "/blocks/auth" },
  { id: "marketing", label: "Marketing", href: "/blocks/marketing" },
  { id: "dashboard", label: "Dashboard", href: "/blocks/dashboard" },
  { id: "communication", label: "Communication", href: "/blocks/communication" },
  { id: "commerce", label: "Commerce", href: "/blocks/commerce" },
];

export const FeaturedBlockChips = ({ active }: { active: FeaturedBlockCategory }) => (
  <div class="blocks-featured" aria-label="Featured block categories">
    {categories.map((category) =>
      category.id === active ? (
        <span class="blocks-featured-chip is-active" key={category.id}>
          {category.label}
        </span>
      ) : (
        <a class="blocks-featured-chip" href={withBasePath(category.href)} key={category.id}>
          {category.label}
        </a>
      ),
    )}
  </div>
);

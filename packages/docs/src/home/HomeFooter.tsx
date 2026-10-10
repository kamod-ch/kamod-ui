import { ArrowRightIcon, ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";
import { KamodUiBrandLogo } from "../layout/KamodUiBrandLogo";
import { footerGroups } from "./home-content";

export function HomeFooter() {
  return (
    <footer class="home-footer">
      <div class="home-footer-main">
        <div class="home-footer-brand">
          <a href={withBasePath("/")} aria-label="Kamod UI home">
            <KamodUiBrandLogo />
          </a>
          <p>
            Thoughtful interfaces start with clear foundations. Components, complete layouts and the
            documentation to make them your own.
          </p>
          <a class="home-text-link" href={withBasePath("/docs/getting-started")}>
            Start Building <ArrowRightIcon size={16} aria-hidden="true" />
          </a>
        </div>
        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <a href={href.startsWith("/") ? withBasePath(href) : href}>
                    {label}
                    {href.startsWith("https:") && <ArrowUpRightIcon size={12} aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div class="home-footer-bottom">
        <p>
          © 2026 <a href="https://www.kamod.ch">Klaus Zahiragic · Kamod</a>
        </p>
        <p>
          Built with <a href="https://github.com/kamod-ch/preactpress">PreactPress</a>
          <span aria-hidden="true"> · </span>
          <a href={withBasePath("/docs/theming/installation")}>One Shared Theme</a>
        </p>
        <a href="#home-title">Back to Top ↑</a>
      </div>
    </footer>
  );
}

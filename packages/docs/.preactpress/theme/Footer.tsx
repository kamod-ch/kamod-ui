import type { FunctionalComponent } from "preact";
import { withBasePath } from "../../src/base-path";

const Footer: FunctionalComponent = () => (
  <footer class="kiw-footer">
    <a
      class="kiw-footer-logo"
      href="https://www.kamod.ch"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="ki-logo__kamod-wrap" aria-hidden="true">
        <img
          src={withBasePath("/kamod-logo-horizontal.svg")}
          alt="kamod"
          class="ki-logo__kamod ki-logo__kamod--light"
          decoding="async"
        />
        <img
          src={withBasePath("/kamod-logo-horizontal-dark.svg")}
          alt=""
          class="ki-logo__kamod ki-logo__kamod--dark"
          decoding="async"
        />
      </span>
    </a>

    <p class="kiw-footer-copy">
      Copyright © 2026 Klaus Zahiragic –{" "}
      <a href="https://www.kamod.ch" target="_blank" rel="noopener noreferrer">
        www.kamod.ch
      </a>
    </p>

    <p class="kiw-footer-built">
      Built with{" "}
      <a href="https://kamod-ch.github.io/preactpress/" target="_blank" rel="noopener noreferrer">
        PreactPress
      </a>
      .
    </p>
  </footer>
);

export default Footer;

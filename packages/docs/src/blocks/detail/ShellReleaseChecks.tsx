import {
  ArrowUpRightIcon,
  ClipboardCheckIcon,
  DeviceDesktopIcon,
  DeviceFloppyIcon,
  GaugeIcon,
  KeyboardIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "@kamod-ch/icons/tabler/outline";
import { withBasePath } from "../../base-path";
import { BrandText } from "../../docs/components/brand/BrandText";

const releaseChecks = [
  {
    title: "Follow the route",
    Icon: RouteIcon,
    action: (
      <>
        Open a nested destination, refresh that page, then use the browser’s Back and Forward
        buttons. Collapse and expand the desktop sidebar. On mobile, open the menu and choose a
        destination. Connect these actions through your{" "}
        <a href="#application-shell-route-lifetime">router and navigation data</a>.
      </>
    ),
    expected: (
      <>
        The <strong>URL, page heading, active link and breadcrumbs agree</strong>. A direct link
        opens the correct page, selecting a mobile destination closes the sheet, and an unavailable
        destination does not navigate or run an action.
      </>
    ),
  },
  {
    title: "Take the keyboard route",
    Icon: KeyboardIcon,
    action: (
      <>
        Put the pointer aside. Use <code>Tab</code> and <code>Shift + Tab</code> to reach the
        sidebar toggle, links and account menu. Use arrow keys inside the menu, then press{" "}
        <code>Escape</code>. Repeat with the mobile sheet and check the page with a screen reader.
      </>
    ),
    expected: (
      <>
        Focus is <strong>visible and follows a sensible order</strong>. Controls announce useful
        names and their expanded state. Closing a menu or sheet with Escape returns focus to its
        trigger. After navigation, your app makes the new page heading discoverable.
      </>
    ),
  },
  {
    title: "Give the layout a stretch",
    Icon: DeviceDesktopIcon,
    action: (
      <>
        Try the screen sizes above with a long page title, translated navigation labels and a wide
        table. Switch between light and dark, then zoom the browser to <code>200%</code>. Review{" "}
        <a href={withBasePath("/blocks/styles")}>Layout and Styling</a> if content spills outside
        the frame.
      </>
    ),
    expected: (
      <>
        Text remains readable and controls stay reachable.{" "}
        <strong>The document does not scroll sideways</strong>; a wide table or editor scrolls
        inside its own area. Long names remain understandable, and text, focus rings and active
        items stay clear in both modes.
      </>
    ),
  },
  {
    title: "Keep unfinished work safe",
    Icon: DeviceFloppyIcon,
    action: (
      <>
        Type a draft, toggle the sidebar and open the account menu before saving. If your page has
        an inspector or another dismissible panel, close and reopen it. Decide separately what
        should happen when users <a href="#application-shell-route-lifetime">leave the route</a>.
      </>
    ),
    expected: (
      <>
        Shell controls <strong>do not erase a page’s draft</strong>. State that must survive an
        unmounted panel lives above that panel. Navigation follows your app’s save, discard or
        confirmation policy; the shell does not persist drafts for you.
      </>
    ),
  },
  {
    title: "Make the unhappy paths useful",
    Icon: ShieldCheckIcon,
    action: (
      <>
        Try a slow request, an empty result, a failed save and an account without access. Give each
        case a clear message and a useful next action. Follow the{" "}
        <a href={withBasePath("/docs/forms#form-submission")}>submission and recovery guide</a> when
        connecting a real form.
      </>
    ),
    expected: (
      <>
        Loading eventually resolves to content or an explanation. Failed saves{" "}
        <strong>preserve edits and offer a safe retry</strong>. Empty pages explain how to get
        started. Your service checks permissions even when a navigation item is hidden.
      </>
    ),
  },
  {
    title: "Check the work behind the screen",
    Icon: GaugeIcon,
    action: (
      <>
        In a production build, record a route change and a short typing session with realistic data
        using the browser’s performance tools. Switch records while a request is pending, then leave
        and revisit the page. Inspect the{" "}
        <a href="#application-shell-data-lifetime">request and cleanup boundaries</a>.
      </>
    ),
    expected: (
      <>
        Typing and navigation stay responsive. An old response cannot overwrite the new record, and
        timers, listeners and subscriptions <strong>stop when their owner leaves</strong>. Paginate
        or virtualize long lists when measurements show a need; keep layout in CSS where possible.
      </>
    ),
  },
];

/** Static acceptance guidance shared by every shell; outcomes describe checks, not test results. */
export function ShellReleaseChecks() {
  return (
    <section class="shell-release" aria-labelledby="application-shell-release-checks">
      <BrandText>
        <p>
          <strong>Test a real journey, from opening a page to saving a change.</strong> These checks
          belong to your integrated application: the shell supplies the frame, while your router,
          forms and services supply the behavior. Work through the steps once, then repeat the
          journey at the sizes and settings below.
        </p>
        <div class="shell-release-setup">
          <h4>Start with one real journey</h4>
          <p>
            For example: open a project, change its name, save it and return to the overview. Use
            realistic records and a test account with limited access as well as a full-access
            account.
          </p>
          <dl class="shell-release-matrix">
            <div>
              <dt>Screen widths</dt>
              <dd>
                <code>320</code> · <code>768</code> · <code>1024</code> · <code>1440px</code>
              </dd>
            </div>
            <div>
              <dt>Appearance</dt>
              <dd>Light + dark · your app’s theme</dd>
            </div>
            <div>
              <dt>Content</dt>
              <dd>Long labels · empty + busy pages</dd>
            </div>
          </dl>
        </div>
        <ol class="shell-release-checks" role="list" aria-label="Release checklist">
          {releaseChecks.map(({ title, Icon, action, expected }, index) => (
            <li key={title}>
              <h4>
                <span class="shell-release-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <Icon size={18} aria-hidden="true" />
                {title}
              </h4>
              <dl class="shell-release-outcomes">
                <div>
                  <dt>Try this</dt>
                  <dd>
                    <p>{action}</p>
                  </dd>
                </div>
                <div>
                  <dt>Looks right when</dt>
                  <dd>
                    <p>{expected}</p>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
        <div class="shell-release-handoff">
          <h4>
            <ClipboardCheckIcon size={18} aria-hidden="true" /> Leave a trail for the next release
          </h4>
          <p>
            Record the <strong>build or commit, browser, screen size and result</strong> in your
            release notes. For a failure, include the steps, expected behavior and a screenshot or
            short recording. Fix and repeat that check before calling the journey ready.
          </p>
          <p>
            Keep the copied shell source and local changes under version control. Compare updates
            before replacing shared helpers, and rerun the affected checks when routing, permissions
            or layout change. Turn repeatable failures into focused automated tests; keep a manual
            keyboard and visual pass as well.
          </p>
          <div class="shell-release-links">
            <a href={withBasePath("/blocks/theming")}>
              Check your theme <ArrowUpRightIcon size={14} aria-hidden="true" />
            </a>
            <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
              Review the whole journey <ArrowUpRightIcon size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </BrandText>
    </section>
  );
}

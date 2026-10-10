import { ArrowUpRightIcon } from "@kamod-ch/icons/tabler/outline";
import { Button, Separator } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import type { OverviewExample } from "../components/OverviewExamples";
import { formWalkthroughs } from "./form-example-walkthroughs";

/** Open documentation prose follows the selected example through its integration lifecycle. */
export function FormExampleReview({ example }: { example: OverviewExample }) {
  const walkthrough = formWalkthroughs[example.id];
  if (!walkthrough) return null;
  const href = walkthrough.href.startsWith("/") ? withBasePath(walkthrough.href) : walkthrough.href;
  return (
    <>
      {example.id === "formisch" && (
        <div class="form-example-handoff">
          <p>
            <strong>Connect Your Save Function.</strong> The <code>onSave</code> callback receives
            validated values typed with <code>v.InferOutput&lt;typeof schema&gt;</code>. Connect it
            to your app’s service and provide clear success or failure feedback: a valid form does
            not mean its data has been saved.
          </p>
          <div class="form-example-handoff-footer">
            <span>
              Example Source <span aria-hidden="true">·</span> Ready to Adapt
            </span>
            <a href={withBasePath("/docs/formisch/installation#usage")}>
              Full Integration Guide <ArrowUpRightIcon size={13} aria-hidden="true" />
            </a>
          </div>
          <Separator class="form-example-handoff-divider" />
        </div>
      )}
      <section
        class="form-example-walkthrough block-guide-prose"
        aria-labelledby={`form-review-${example.id}`}
      >
        <header class="form-walkthrough-header">
          <h3 id={`form-review-${example.id}`}>{walkthrough.title}</h3>
          <Button
            href={href}
            class="docs-icon-button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Read ${walkthrough.link}`}
            title={walkthrough.link}
          >
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </Button>
        </header>
        <p class="form-walkthrough-introduction">{walkthrough.introduction}</p>
        <div class="form-walkthrough-stages">
          {walkthrough.stages.map(({ title, context, body }) => (
            <section key={title} class="form-walkthrough-stage">
              <div class="form-walkthrough-stage-heading">
                <h4>{title}</h4>
                <span>
                  <span aria-hidden="true">·</span> {context}
                </span>
              </div>
              <p>{body}</p>
            </section>
          ))}
        </div>
        <aside class="form-walkthrough-takeaway" aria-label="Before moving on">
          <span>Before Moving On</span>
          <p>{walkthrough.takeaway}</p>
        </aside>
        <footer class="form-walkthrough-footer">
          <span>
            Continue Reading <span aria-hidden="true">·</span>
          </span>
          <a href={href}>
            {walkthrough.link}
            <ArrowUpRightIcon size={13} aria-hidden="true" />
          </a>
        </footer>
      </section>
    </>
  );
}

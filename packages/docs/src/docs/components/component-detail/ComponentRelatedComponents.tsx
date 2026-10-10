import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocPageModule } from "../../types";
import { InlineCodeLink } from "../InlineCodeLink";
import { CompositionNextSteps } from "./CompositionNextSteps";
import { componentCompanions } from "./component-companions";

/** Open reading sections explain each companion's role before linking to its API. */
export function ComponentRelatedComponents({
  doc,
  related,
}: {
  doc: DocPageModule;
  related: readonly string[];
}) {
  return (
    <section class="component-composition block-guide-prose" aria-labelledby="integration-compose">
      <h3 id="integration-compose" tabIndex={-1}>
        <BlockHeadingLink id="integration-compose">Compose a Complete Interface</BlockHeadingLink>
      </h3>
      <p>
        <strong>Give Each Piece One Responsibility.</strong> Start with what{" "}
        <strong>{doc.title}</strong> already provides, then add a companion only when the task needs
        another action, explanation or boundary. Follow the references for that component’s own API;
        neighboring components do not necessarily share the same props.
      </p>
      <p>
        Keep{" "}
        <a href={withBasePath("/docs/getting-started#give-state-one-owner")}>One Source of Truth</a>{" "}
        for the operation and let each component communicate a different part of it. For example,{" "}
        <strong>Waiting, No Results and Failure</strong> need different explanations. Avoid showing
        contradictory states together, and keep recovery actions close to their message.
      </p>
      <div class="component-companion-list">
        {[...new Set(related)]
          .filter((slug) => slug !== doc.slug)
          .map((slug) => {
            const profile = componentCompanions[slug];
            const name = slug
              .split("-")
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join("");
            const id = `compose-with-${slug}`;
            return (
              <section key={slug} class="component-companion" aria-labelledby={id}>
                <div class="component-companion-heading">
                  <h4 id={id} tabIndex={-1}>
                    <BlockHeadingLink id={id}>
                      {profile?.heading ?? `Connect ${name} to the Task`}
                    </BlockHeadingLink>
                  </h4>
                  <InlineCodeLink href={`/docs/${slug}/installation`}>{name}</InlineCodeLink>
                </div>
                <p>
                  {profile?.description ?? (
                    <>
                      Read the component’s documented composition and choose the behavior your task
                      needs before adapting its appearance.
                    </>
                  )}
                </p>
                {profile && (
                  <p class="component-companion-connection">
                    <strong>Connect It</strong>
                    <span aria-hidden="true"> · </span>
                    {profile.connection}
                  </p>
                )}
              </section>
            );
          })}
      </div>
      <CompositionNextSteps />
    </section>
  );
}

import { fireEvent } from "@testing-library/preact";
import { hydrate, render } from "preact";
import { act } from "preact/test-utils";
import { renderToString } from "preact-render-to-string";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index";

/** Repeated values must still produce distinct IDs in sibling tab groups. */
function TabGroups() {
  return (
    <>
      {[false, true].map((forceMount) => (
        <Tabs key={String(forceMount)} defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one" forceMount={forceMount}>
            Panel one
          </TabsContent>
          <TabsContent value="two" forceMount={forceMount}>
            Panel two
          </TabsContent>
        </Tabs>
      ))}
    </>
  );
}

function expectLinkedPanels(container: HTMLElement) {
  const ids = [...container.querySelectorAll("[id]")].map((element) => element.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const panel of container.querySelectorAll('[role="tabpanel"]')) {
    const trigger = document.getElementById(panel.getAttribute("aria-labelledby")!);
    expect(trigger).not.toBeNull();
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
  }
}

it("generates the same tab IDs for independent server renders", () => {
  expect(renderToString(<TabGroups />)).toBe(renderToString(<TabGroups />));
});

it("preserves server-rendered IDs and ARIA relationships after hydration and tab changes", () => {
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = renderToString(<TabGroups />);
  const triggers = [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const serverIds = triggers.map((trigger) => trigger.id);

  try {
    expectLinkedPanels(container);
    act(() => hydrate(<TabGroups />, container));
    expect([...container.querySelectorAll('[role="tab"]')].map((tab) => tab.id)).toEqual(serverIds);
    for (const trigger of [triggers[1], triggers[3], triggers[0], triggers[2]]) {
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-selected", "true");
      expectLinkedPanels(container);
      const panel = document.getElementById(trigger.getAttribute("aria-controls")!);
      expect(panel).toBeVisible();
    }
  } finally {
    act(() => render(null, container));
    container.remove();
  }
});

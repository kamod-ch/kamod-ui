import { Accordion, AccordionItem, AccordionTrigger } from "@kamod-ch/ui/accordion";
import { Dialog, DialogTitle, DialogTrigger } from "@kamod-ch/ui/dialog";
import { renderToString } from "preact-render-to-string";
import { MotionAccordionContent } from "./accordion/index.js";
import { MotionDialogContent, MotionDialogOverlay, MotionDialogPortal } from "./dialog/index.js";

describe("SSR", () => {
  it("imports and renderToString motion dialog without throwing", () => {
    expect(() =>
      renderToString(
        <Dialog defaultOpen>
          <DialogTrigger>Open</DialogTrigger>
          <MotionDialogPortal>
            <MotionDialogOverlay />
            <MotionDialogContent>
              <DialogTitle>SSR dialog</DialogTitle>
            </MotionDialogContent>
          </MotionDialogPortal>
        </Dialog>,
      ),
    ).not.toThrow();
  });

  it("imports and renderToString motion accordion without throwing", () => {
    const html = renderToString(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <MotionAccordionContent>Body</MotionAccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(html).toContain("Body");
    expect(html).toContain('data-slot="accordion-content"');
  });
});

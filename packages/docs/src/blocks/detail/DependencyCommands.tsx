/** Package-manager alternatives shared by every copy-and-adapt guide. */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { CodeBlock } from "../../docs/components/CodeBlock";
export function DependencyCommands({ dependencies }: { dependencies: readonly string[] }) {
  const packages = dependencies.join(" ");
  const commands = {
    pnpm: `pnpm add ${packages}`,
    npm: `npm install ${packages}`,
    yarn: `yarn add ${packages}`,
  };
  return (
    <Tabs defaultValue="pnpm" class="docs-tabs">
      <TabsList class="docs-tabs-list" variant="line" aria-label="Package manager">
        {Object.keys(commands).map((manager) => (
          <TabsTrigger key={manager} value={manager}>
            {manager}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(commands).map(([manager, command]) => (
        <TabsContent key={manager} value={manager}>
          <CodeBlock code={command} language="bash" className="docs-tab-code" />
        </TabsContent>
      ))}
    </Tabs>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui/tabs";
import { MotionTabsIndicator } from "@kamod-ch/ui-motion/tabs";

export function MotionTabsDemo() {
  return (
    <Tabs defaultValue="account" class="w-full max-w-md">
      <TabsList class="relative w-full">
        <MotionTabsIndicator />
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account" class="docs-tabs-panel">
        Manage your profile and notification preferences.
      </TabsContent>
      <TabsContent value="password" class="docs-tabs-panel">
        Update your password and two-factor settings.
      </TabsContent>
      <TabsContent value="billing" class="docs-tabs-panel">
        View invoices and payment methods.
      </TabsContent>
    </Tabs>
  );
}

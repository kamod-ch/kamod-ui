import { Route, Router } from "preact-iso";
import { withBasePath } from "./base-path";
import { DocsComponentPage } from "./docs/DocsComponentPage";
import { DocsOverviewPage } from "./docs/DocsOverviewPage";
import { KitchenSinkPage } from "./kitchen-sink/KitchenSinkPage";

export const App = () => (
  <Router>
    <Route path={withBasePath("/")} component={KitchenSinkPage} />
    <Route path={withBasePath("/kitchen-sink")} component={KitchenSinkPage} />
    <Route path={withBasePath("/docs/components")} component={DocsOverviewPage} />
    <Route path={withBasePath("/docs/:slug/:section?")} component={DocsComponentPage} />
    <Route default component={KitchenSinkPage} />
  </Router>
);

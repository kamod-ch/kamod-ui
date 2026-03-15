import { Route, Router } from "preact-iso";
import { DocsComponentPage } from "./docs/DocsComponentPage";
import { DocsOverviewPage } from "./docs/DocsOverviewPage";
import { KitchenSinkPage } from "./kitchen-sink/KitchenSinkPage";

export const App = () => (
  <Router>
    <Route path="/" component={KitchenSinkPage} />
    <Route path="/kitchen-sink" component={KitchenSinkPage} />
    <Route path="/docs/components" component={DocsOverviewPage} />
    <Route path="/docs/:slug/:section?" component={DocsComponentPage} />
    <Route default component={KitchenSinkPage} />
  </Router>
);

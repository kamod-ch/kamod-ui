import { DocsTopbarActions } from "../../layout/DocsTopbarActions";
import { SaasTeamDemoApp } from "./SaasTeamDemoApp";

/** Docs route wrapper for `/demo/saas-team`. */
export function SaasTeamDemoPage() {
  return <SaasTeamDemoApp topChrome={<DocsTopbarActions />} />;
}

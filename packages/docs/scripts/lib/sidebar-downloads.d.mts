export type InstallationFile = { path: string; label: string; kind: string };
export type SidebarInstallation = {
  id: string;
  files: InstallationFile[];
  sources: Record<string, string>;
  zip: Uint8Array;
};
export const blocksRoot: string;
export function moduleReferences(
  filename: string,
  source: string,
): { value: string; start: number; end: number }[];
export function createSidebarInstallation(id: string): SidebarInstallation;
export function createSidebarInstallations(): SidebarInstallation[];
export function writeInstallationManifest(
  installations?: SidebarInstallation[],
): Record<string, InstallationFile[]>;

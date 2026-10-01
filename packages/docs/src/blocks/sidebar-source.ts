/** Downloaded source is identical to the ZIP, including relocated relative imports. */
import type { SidebarBlockId } from "@kamod-ch/blocks";
import { sidebarBlockMetadata } from "../../../blocks/src/sidebar/metadata";
import { withBasePath } from "../base-path";

const pending = new Map<SidebarBlockId, Promise<Record<string, string>>>();

/** One bounded cache entry per registered variant; failed requests can be retried. */
export async function getSidebarBlockSource(id: SidebarBlockId, label: string): Promise<string> {
  const block = sidebarBlockMetadata.find((entry) => entry.id === id);
  if (!block?.files.some((file) => file.label === label))
    throw new Error(`Block source not found: ${label}`);
  let request = pending.get(id);
  if (!request) {
    request = fetch(withBasePath(`/blocks/downloads/${id}.json`))
      .then(async (response) => {
        if (!response.ok) throw new Error(`Unable to load ${id} source (${response.status})`);
        const sources: unknown = await response.json();
        if (!sources || typeof sources !== "object" || Array.isArray(sources))
          throw new Error(`Invalid source response for ${id}`);
        return sources as Record<string, string>;
      })
      .catch((error: unknown) => {
        pending.delete(id);
        throw error;
      });
    pending.set(id, request);
  }
  const source = (await request)[label];
  if (typeof source !== "string") {
    if (pending.get(id) === request) pending.delete(id);
    throw new Error(`Block source not found: ${label}`);
  }
  return source;
}

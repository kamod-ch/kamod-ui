/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { SAAS_TEAM_DEMO_SEED } from "./saas-team-data";
import { useSaasTeamDemo } from "./use-saas-team-demo";

describe("useSaasTeamDemo", () => {
  it("filters, invites, and resets deterministically", () => {
    const { result } = renderHook(() => useSaasTeamDemo());
    expect(result.current.metrics.totalMembers).toBe(SAAS_TEAM_DEMO_SEED.length);

    act(() => result.current.setSearch("taylor"));
    expect(result.current.filteredMembers).toHaveLength(1);

    act(() => {
      result.current.inviteMember("Casey Kim", "casey@kamod-demo.test", "member");
    });
    expect(result.current.metrics.totalMembers).toBe(SAAS_TEAM_DEMO_SEED.length + 1);
    expect(result.current.metrics.pendingInvites).toBe(2);

    act(() => result.current.resetDemo());
    expect(result.current.metrics).toEqual({
      totalMembers: 5,
      activeSeats: 4,
      pendingInvites: 1,
    });
    expect(result.current.search).toBe("");
  });
});

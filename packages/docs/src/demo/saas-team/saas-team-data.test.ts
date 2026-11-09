import { describe, expect, it } from "vitest";
import { computeTeamMetrics, SAAS_TEAM_DEMO_SEED } from "./saas-team-data";

describe("saas-team-data", () => {
  it("computes metrics from the member list", () => {
    expect(computeTeamMetrics(SAAS_TEAM_DEMO_SEED)).toEqual({
      totalMembers: 5,
      activeSeats: 4,
      pendingInvites: 1,
    });
  });
});

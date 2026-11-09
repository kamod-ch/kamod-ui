export type TeamRole = "owner" | "admin" | "member" | "viewer";
export type TeamMemberStatus = "active" | "invited";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamMemberStatus;
  joinedAt: string;
};

export const SAAS_TEAM_DEMO_SEED: TeamMember[] = [
  {
    id: "m1",
    name: "Alex Morgan",
    email: "alex@kamod-demo.test",
    role: "owner",
    status: "active",
    joinedAt: "2025-06-12",
  },
  {
    id: "m2",
    name: "Jamie Park",
    email: "jamie@kamod-demo.test",
    role: "admin",
    status: "active",
    joinedAt: "2025-08-03",
  },
  {
    id: "m3",
    name: "Sam Rivera",
    email: "sam@kamod-demo.test",
    role: "member",
    status: "active",
    joinedAt: "2025-09-18",
  },
  {
    id: "m4",
    name: "Taylor Brooks",
    email: "taylor@kamod-demo.test",
    role: "member",
    status: "invited",
    joinedAt: "2025-11-01",
  },
  {
    id: "m5",
    name: "Riley Chen",
    email: "riley@kamod-demo.test",
    role: "viewer",
    status: "active",
    joinedAt: "2025-10-22",
  },
];

export type TeamMetrics = {
  totalMembers: number;
  activeSeats: number;
  pendingInvites: number;
};

export function computeTeamMetrics(members: readonly TeamMember[]): TeamMetrics {
  return {
    totalMembers: members.length,
    activeSeats: members.filter((member) => member.status === "active").length,
    pendingInvites: members.filter((member) => member.status === "invited").length,
  };
}

import { useCallback, useMemo, useState } from "preact/hooks";
import {
  computeTeamMetrics,
  SAAS_TEAM_DEMO_SEED,
  type TeamMember,
  type TeamRole,
} from "./saas-team-data";

export type TeamSortKey = "name" | "role" | "status" | "joinedAt";
export type SortDirection = "asc" | "desc";

const nextId = () => `m${Math.random().toString(36).slice(2, 9)}`;

function compareMembers(a: TeamMember, b: TeamMember, key: TeamSortKey): number {
  const av = a[key];
  const bv = b[key];
  return String(av).localeCompare(String(bv), undefined, { sensitivity: "base" });
}

export function useSaasTeamDemo() {
  const [members, setMembers] = useState<TeamMember[]>(() =>
    SAAS_TEAM_DEMO_SEED.map((member) => ({ ...member })),
  );
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<TeamRole | "all">("all");
  const [sortKey, setSortKey] = useState<TeamSortKey>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const metrics = useMemo(() => computeTeamMetrics(members), [members]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = members;
    if (query) {
      list = list.filter(
        (member) =>
          member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query),
      );
    }
    if (roleFilter !== "all") {
      list = list.filter((member) => member.role === roleFilter);
    }
    const sorted = [...list].sort((a, b) => compareMembers(a, b, sortKey));
    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }, [members, roleFilter, search, sortDir, sortKey]);

  const toggleSort = useCallback(
    (key: TeamSortKey) => {
      if (sortKey === key) {
        setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  const resetDemo = useCallback(() => {
    setMembers(SAAS_TEAM_DEMO_SEED.map((member) => ({ ...member })));
    setSearch("");
    setRoleFilter("all");
    setSortKey("name");
    setSortDir("asc");
  }, []);

  const updateMember = useCallback(
    (id: string, patch: Partial<Pick<TeamMember, "name" | "email" | "role">>) => {
      setMembers((current) =>
        current.map((member) => (member.id === id ? { ...member, ...patch } : member)),
      );
    },
    [],
  );

  const inviteMember = useCallback((name: string, email: string, role: TeamRole) => {
    const member: TeamMember = {
      id: nextId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      status: "invited",
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setMembers((current) => [...current, member]);
    return member;
  }, []);

  return {
    members,
    metrics,
    filteredMembers,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sortKey,
    sortDir,
    toggleSort,
    resetDemo,
    updateMember,
    inviteMember,
  };
}

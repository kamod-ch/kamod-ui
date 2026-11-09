import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ch/ui";
import { useEffect, useId, useState } from "preact/hooks";
import type { TeamMember, TeamRole } from "./saas-team-data";
import type { TeamSortKey, useSaasTeamDemo } from "./use-saas-team-demo";

type DemoState = ReturnType<typeof useSaasTeamDemo>;

const roleLabels: Record<TeamRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

function SortableHead({
  label,
  sortKey,
  activeKey,
  sortDir,
  onSort,
}: {
  label: string;
  sortKey: TeamSortKey;
  activeKey: TeamSortKey;
  sortDir: "asc" | "desc";
  onSort: (key: TeamSortKey) => void;
}) {
  const active = activeKey === sortKey;
  const suffix = active ? (sortDir === "asc" ? " · ascending" : " · descending") : "";
  return (
    <TableHead scope="col">
      <button
        type="button"
        class="saas-team-sort-btn"
        onClick={() => onSort(sortKey)}
        aria-label={`${label}${suffix}`}
      >
        {label}
        {active ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </TableHead>
  );
}

export function SaasTeamOverview({ metrics }: Pick<DemoState, "metrics">) {
  const cards = [
    {
      title: "Team members",
      value: String(metrics.totalMembers),
      description: "Everyone in this demo workspace",
    },
    {
      title: "Active seats",
      value: String(metrics.activeSeats),
      description: "Members who accepted an invite",
    },
    {
      title: "Pending invites",
      value: String(metrics.pendingInvites),
      description: "Waiting for acceptance",
    },
  ];
  return (
    <section aria-labelledby="saas-team-overview-title">
      <h1 id="saas-team-overview-title" class="text-2xl font-semibold tracking-tight">
        Overview
      </h1>
      <p class="mt-2 max-w-prose text-sm text-muted-foreground">
        These counts are derived from the same local list you can search and edit on the Team page.
      </p>
      <div class="saas-team-metrics mt-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader class="pb-2">
              <CardDescription>{card.title}</CardDescription>
              <CardTitle class="text-3xl tabular-nums">{card.value}</CardTitle>
            </CardHeader>
            <CardContent class="pt-0 text-sm text-muted-foreground">{card.description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MemberEditDialog({
  member,
  open,
  onOpenChange,
  onSave,
}: {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, patch: Pick<TeamMember, "name" | "email" | "role">) => void;
}) {
  const baseId = useId();
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [role, setRole] = useState<TeamRole>(member?.role ?? "member");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !member) return;
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setError(null);
  }, [member, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit teammate</DialogTitle>
          <DialogDescription>
            Updates apply only in this browser tab. Owners cannot be demoted in the demo.
          </DialogDescription>
        </DialogHeader>
        <form
          id={`${baseId}-form`}
          class="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!member) return;
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            if (!trimmedName || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
              setError("Enter a name and a valid email address.");
              return;
            }
            if (member.role === "owner" && role !== "owner") {
              setError("The demo owner role stays fixed.");
              return;
            }
            onSave(member.id, { name: trimmedName, email: trimmedEmail, role });
            onOpenChange(false);
          }}
        >
          <div class="grid gap-2">
            <Label htmlFor={`${baseId}-name`}>Name</Label>
            <Input
              id={`${baseId}-name`}
              value={name}
              required
              onInput={(event) => setName(event.currentTarget.value)}
            />
          </div>
          <div class="grid gap-2">
            <Label htmlFor={`${baseId}-email`}>Email</Label>
            <Input
              id={`${baseId}-email`}
              type="email"
              value={email}
              required
              onInput={(event) => setEmail(event.currentTarget.value)}
            />
          </div>
          <div class="grid gap-2">
            <Label htmlFor={`${baseId}-role`}>Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as TeamRole)}>
              <SelectTrigger id={`${baseId}-role`} disabled={member?.role === "owner"}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(roleLabels) as TeamRole[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {roleLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error ? (
            <p role="alert" class="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={`${baseId}-form`}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (name: string, email: string, role: TeamRole) => void;
}) {
  const baseId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("member");
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setName("");
          setEmail("");
          setRole("member");
          setError(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>
            Adds a row with invited status. No email is sent in this demo.
          </DialogDescription>
        </DialogHeader>
        <form
          id={`${baseId}-invite`}
          class="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            if (!trimmedName || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
              setError("Enter a name and a valid email address.");
              return;
            }
            onInvite(trimmedName, trimmedEmail, role);
            onOpenChange(false);
          }}
        >
          <div class="grid gap-2">
            <Label htmlFor={`${baseId}-invite-name`}>Name</Label>
            <Input
              id={`${baseId}-invite-name`}
              value={name}
              required
              onInput={(event) => setName(event.currentTarget.value)}
            />
          </div>
          <div class="grid gap-2">
            <Label htmlFor={`${baseId}-invite-email`}>Email</Label>
            <Input
              id={`${baseId}-invite-email`}
              type="email"
              value={email}
              required
              onInput={(event) => setEmail(event.currentTarget.value)}
            />
          </div>
          <div class="grid gap-2">
            <Label htmlFor={`${baseId}-invite-role`}>Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as TeamRole)}>
              <SelectTrigger id={`${baseId}-invite-role`}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {(["admin", "member", "viewer"] as const).map((key) => (
                  <SelectItem key={key} value={key}>
                    {roleLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error ? (
            <p role="alert" class="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={`${baseId}-invite`}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SaasTeamTeamView(state: DemoState) {
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const searchId = useId();
  const roleFilterId = useId();

  return (
    <section aria-labelledby="saas-team-team-title">
      <div class="saas-team-toolbar">
        <div>
          <h1 id="saas-team-team-title" class="text-2xl font-semibold tracking-tight">
            Team
          </h1>
          <p class="mt-2 text-sm text-muted-foreground">
            Search, filter by role, sort columns, and edit a row or invite someone new.
          </p>
        </div>
        <Button type="button" data-testid="saas-team-invite" onClick={() => setInviteOpen(true)}>
          Invite teammate
        </Button>
      </div>

      <div class="saas-team-toolbar mt-6">
        <div class="saas-team-toolbar-filters">
          <div class="grid min-w-[12rem] flex-1 gap-2">
            <Label htmlFor={searchId}>Search</Label>
            <Input
              id={searchId}
              data-testid="saas-team-search"
              value={state.search}
              placeholder="Name or email"
              onInput={(event) => state.setSearch(event.currentTarget.value)}
            />
          </div>
          <div class="grid min-w-[10rem] gap-2">
            <Label htmlFor={roleFilterId}>Role</Label>
            <Select
              value={state.roleFilter}
              onValueChange={(value) => state.setRoleFilter(value as TeamRole | "all")}
            >
              <SelectTrigger id={roleFilterId} data-testid="saas-team-role-filter">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {(Object.keys(roleLabels) as TeamRole[]).map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div class="saas-team-table-wrap mt-4">
        <Table data-testid="saas-team-table">
          <TableHeader>
            <TableRow>
              <SortableHead
                label="Name"
                sortKey="name"
                activeKey={state.sortKey}
                sortDir={state.sortDir}
                onSort={state.toggleSort}
              />
              <TableHead scope="col">Email</TableHead>
              <SortableHead
                label="Role"
                sortKey="role"
                activeKey={state.sortKey}
                sortDir={state.sortDir}
                onSort={state.toggleSort}
              />
              <SortableHead
                label="Status"
                sortKey="status"
                activeKey={state.sortKey}
                sortDir={state.sortDir}
                onSort={state.toggleSort}
              />
              <SortableHead
                label="Joined"
                sortKey="joinedAt"
                activeKey={state.sortKey}
                sortDir={state.sortDir}
                onSort={state.toggleSort}
              />
              <TableHead scope="col" class="text-end">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} class="py-10 text-center text-muted-foreground">
                  No teammates match this search and filter.
                </TableCell>
              </TableRow>
            ) : (
              state.filteredMembers.map((member) => (
                <TableRow key={member.id} data-testid={`saas-team-row-${member.id}`}>
                  <TableCell class="font-medium">{member.name}</TableCell>
                  <TableCell class="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>{roleLabels[member.role]}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === "active" ? "secondary" : "outline"}>
                      {member.status === "active" ? "Active" : "Invited"}
                    </Badge>
                  </TableCell>
                  <TableCell class="tabular-nums text-muted-foreground">
                    {member.joinedAt}
                  </TableCell>
                  <TableCell class="text-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(member)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MemberEditDialog
        member={editing}
        open={editing != null}
        onOpenChange={(next) => !next && setEditing(null)}
        onSave={state.updateMember}
      />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={state.inviteMember} />
    </section>
  );
}

export function SaasTeamSettings({
  workspaceName,
  onWorkspaceNameChange,
  onReset,
}: {
  workspaceName: string;
  onWorkspaceNameChange: (value: string) => void;
  onReset: () => void;
}) {
  const id = useId();
  return (
    <section aria-labelledby="saas-team-settings-title">
      <h1 id="saas-team-settings-title" class="text-2xl font-semibold tracking-tight">
        Settings
      </h1>
      <p class="mt-2 max-w-prose text-sm text-muted-foreground">
        Appearance follows the site theme controls in the top bar. Reset restores the seed team
        list.
      </p>
      <Card class="mt-6 max-w-lg">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Stored locally for this demo route.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label htmlFor={`${id}-workspace`}>Display name</Label>
            <Input
              id={`${id}-workspace`}
              value={workspaceName}
              maxLength={48}
              onInput={(event) => onWorkspaceNameChange(event.currentTarget.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            data-testid="saas-team-reset"
            onClick={() => {
              onReset();
              onWorkspaceNameChange("Kamod SaaS Demo");
            }}
          >
            Reset demo data
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

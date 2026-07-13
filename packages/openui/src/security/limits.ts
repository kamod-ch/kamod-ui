import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  DEFAULT_MAX_TOTAL_NODES,
  DEFAULT_MAX_TREE_DEPTH,
} from "../constants";

export type KamodOpenUISecurityPolicy = {
  maxTreeDepth?: number;
  maxChildrenPerNode?: number;
  maxTotalNodes?: number;
};

export type ResolvedSecurityPolicy = {
  maxTreeDepth: number;
  maxChildrenPerNode: number;
  maxTotalNodes: number;
};

export function resolveSecurityPolicy(
  policy: KamodOpenUISecurityPolicy = {},
): ResolvedSecurityPolicy {
  return {
    maxTreeDepth: policy.maxTreeDepth ?? DEFAULT_MAX_TREE_DEPTH,
    maxChildrenPerNode: policy.maxChildrenPerNode ?? DEFAULT_MAX_CHILDREN_PER_NODE,
    maxTotalNodes: policy.maxTotalNodes ?? DEFAULT_MAX_TOTAL_NODES,
  };
}

export type TreeLimitViolation =
  | { code: "max_children"; count: number; limit: number }
  | { code: "max_depth"; depth: number; limit: number }
  | { code: "max_nodes"; count: number; limit: number };

/**
 * Lightweight structural guard for host-side validation of parsed trees.
 * OpenUI schema validation remains the primary gate; this enforces aggregate limits.
 */
export function checkChildrenLimit(
  children: unknown[] | undefined,
  policy: ResolvedSecurityPolicy,
): TreeLimitViolation | null {
  if (!children) return null;
  if (children.length > policy.maxChildrenPerNode) {
    return {
      code: "max_children",
      count: children.length,
      limit: policy.maxChildrenPerNode,
    };
  }
  return null;
}

export function assertWithinChildrenLimit(
  children: unknown[] | undefined,
  policy: ResolvedSecurityPolicy,
): unknown[] {
  const violation = checkChildrenLimit(children, policy);
  if (violation) {
    return (children ?? []).slice(0, policy.maxChildrenPerNode);
  }
  return children ?? [];
}

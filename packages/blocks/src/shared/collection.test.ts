import { describe, expect, it } from "vitest";
import { groupBy } from "./collection";

describe("groupBy", () => {
  it("groups items by key without mutating the source", () => {
    const items = [
      { id: "1", bucket: "today" },
      { id: "2", bucket: "earlier" },
      { id: "3", bucket: "today" },
    ] as const;
    const grouped = groupBy(items, (item) => item.bucket);
    expect(grouped.today.map((item) => item.id)).toEqual(["1", "3"]);
    expect(grouped.earlier.map((item) => item.id)).toEqual(["2"]);
    expect(items).toHaveLength(3);
  });
});

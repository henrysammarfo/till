import { describe, expect, it } from "vitest";
import { toDataSuffix, fromDataSuffix } from "@celo/attribution-tags";

describe("attribution tags", () => {
  it("round-trips a celo_ tag", () => {
    const tag = "celo_abcdef012345";
    const suffix = toDataSuffix(tag);
    const decoded = fromDataSuffix(suffix);
    expect(decoded?.codes).toContain(tag);
  });
});

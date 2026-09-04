import { describe, expect, it } from "vitest";
import { tillIntentSchema } from "./intent";

describe("tillIntentSchema", () => {
  it("accepts structured cNGN intent", () => {
    const parsed = tillIntentSchema.parse({
      asset: "cNGN",
      amount: "5",
      to: "0x1111111111111111111111111111111111111111",
    });
    expect(parsed.asset).toBe("cNGN");
  });

  it("rejects invalid address", () => {
    expect(() =>
      tillIntentSchema.parse({
        asset: "cNGN",
        amount: "5",
        to: "not-an-address",
      }),
    ).toThrow();
  });
});

import { describe, expect, it } from "vitest";
import { isValidDemoOtp, isValidMobile } from "./r2g-demo-logic";

describe("R2G demo verification rules", () => {
  it("accepts only a 10-digit mobile number", () => {
    expect(isValidMobile("9876543210")).toBe(true);
    expect(isValidMobile("987654321")).toBe(false);
    expect(isValidMobile("98765432101")).toBe(false);
  });

  it("accepts the demo OTP 1234", () => {
    expect(isValidDemoOtp("1234")).toBe(true);
    expect(isValidDemoOtp("0000")).toBe(false);
  });
});
import { describe, it, expect, beforeAll } from "vitest";
import { supabaseAdmin } from "@/supabaseAdmin";
import { fetchResumeURLifExists } from "./userDataService";

describe("fetchResumeURL", () => {
  const test_user_id: string = "6c7094dc-aa36-402f-ad6e-0880f3ac52e0";

  it("DEBUG: check what's in the database", async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", "6c7094dc-aa36-402f-ad6e-0880f3ac52e0");

    console.log("🔍 Direct query result:");
    console.log("  data:", data);
    console.log("  error:", error);

    expect(data).toBeDefined();
  });

  it("must return resumeURl if its exists", async () => {
    const result = await fetchResumeURLifExists(test_user_id);
    console.log("result:", result);

    expect(result).toBeDefined();

    if (result) {
      expect(result).toMatch(/^https?:\/\//);
    }
  });

  it("must return null if user id is not exists", async () => {
    const result = await fetchResumeURLifExists("00000000-0000-0000-0000-000000000000");

    expect(result).toBeNull();
  });
});

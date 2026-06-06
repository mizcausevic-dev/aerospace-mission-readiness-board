import { describe, expect, it } from "vitest";
import fixture from "../fixtures/mission-readiness.json" with { type: "json" };
import { buildMissionSummary, scoreMission, type MissionInput } from "../src/index.js";

describe("aerospace mission readiness", () => {
  it("prioritizes hold mission lanes", () => {
    const summary = buildMissionSummary(fixture as MissionInput);
    expect(summary.findings[0].missionId).toBe("ORBITAL-DAWN-4");
    expect(summary.holdMissions).toBe(2);
  });

  it("increases risk with comms loss and propulsion anomalies", () => {
    const base = (fixture as MissionInput).missions[1];
    const clean = scoreMission(base);
    const degraded = scoreMission({ ...base, commsLossMinutes: 45, propulsionAnomalies: 2 });
    expect(degraded.missionRiskScore).toBeGreaterThan(clean.missionRiskScore);
    expect(degraded.readiness).toBe("hold");
  });
});

export interface MissionLane {
  missionId: string;
  mission: string;
  launchWindowDays: number;
  propulsionAnomalies: number;
  thermalMarginPercent: number;
  commsLossMinutes: number;
  guidanceSoftwareFindings: number;
  supplierExceptionCount: number;
  crewSafetyWaivers: number;
  owner: string;
  nextAction: string;
}

export interface MissionInput {
  asOf: string;
  program: string;
  missions: MissionLane[];
}

export interface MissionFinding extends MissionLane {
  missionRiskScore: number;
  readiness: "go" | "watch" | "hold";
  boardNarrative: string;
}

export interface MissionSummary {
  asOf: string;
  program: string;
  aggregateMissionRisk: number;
  holdMissions: number;
  primaryRecommendation: string;
  findings: MissionFinding[];
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));
const round = (value: number): number => Math.round(value * 100) / 100;

export function scoreMission(mission: MissionLane): MissionFinding {
  const missionRiskScore = round(
    clamp(
      Math.max(0, 30 - mission.launchWindowDays) * 0.8 +
        mission.propulsionAnomalies * 18 +
        Math.max(0, 25 - mission.thermalMarginPercent) * 1.6 +
        mission.commsLossMinutes * 0.9 +
        mission.guidanceSoftwareFindings * 9 +
        mission.supplierExceptionCount * 8 +
        mission.crewSafetyWaivers * 12
    )
  );
  const readiness = missionRiskScore >= 72 ? "hold" : missionRiskScore >= 38 ? "watch" : "go";
  const boardNarrative =
    readiness === "hold"
      ? `${mission.missionId} should stay out of launch-go posture until the mission assurance packet closes.`
      : readiness === "watch"
        ? `${mission.missionId} can remain in constrained readiness with owner-visible remediation.`
        : `${mission.missionId} is ready for monitored mission operations.`;

  return { ...mission, missionRiskScore, readiness, boardNarrative };
}

export function buildMissionSummary(input: MissionInput): MissionSummary {
  if (!input.missions.length) {
    throw new Error("At least one mission lane is required.");
  }
  const findings = input.missions.map(scoreMission).sort((a, b) => b.missionRiskScore - a.missionRiskScore);
  const aggregateMissionRisk = round(findings.reduce((sum, mission) => sum + mission.missionRiskScore, 0) / findings.length);
  const holdMissions = findings.filter((mission) => mission.readiness === "hold").length;
  const top = findings[0];
  return {
    asOf: input.asOf,
    program: input.program,
    aggregateMissionRisk,
    holdMissions,
    primaryRecommendation: `${top.missionId}: ${top.nextAction}`,
    findings
  };
}

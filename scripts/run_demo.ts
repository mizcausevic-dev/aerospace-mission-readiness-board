import { readFileSync } from "node:fs";
import { buildMissionSummary, type MissionInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/mission-readiness.json", "utf8")) as MissionInput;
const summary = buildMissionSummary(input);
console.log(`program=${summary.program}`);
console.log(`risk=${summary.aggregateMissionRisk}`);
console.log(`hold=${summary.holdMissions}`);
console.log(`recommendation=${summary.primaryRecommendation}`);

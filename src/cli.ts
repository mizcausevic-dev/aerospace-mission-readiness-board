import { readFileSync } from "node:fs";
import { buildMissionSummary, type MissionInput } from "./index.js";

const inputPath = process.argv[2] ?? "fixtures/mission-readiness.json";
const input = JSON.parse(readFileSync(inputPath, "utf8")) as MissionInput;
console.log(JSON.stringify(buildMissionSummary(input), null, 2));

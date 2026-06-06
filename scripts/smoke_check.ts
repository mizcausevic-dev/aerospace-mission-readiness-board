import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
for (const marker of ["Aerospace Mission Readiness Board", "Mission readiness becomes visible", "ORBITAL-DAWN-4", "RANGE-HAWK-7"]) {
  if (!html.includes(marker)) {
    throw new Error(`Missing smoke marker: ${marker}`);
  }
}
console.log("smoke ok");

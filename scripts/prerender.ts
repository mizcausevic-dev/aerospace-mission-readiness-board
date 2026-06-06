import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { MissionInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/mission-readiness.json", "utf8")) as MissionInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");

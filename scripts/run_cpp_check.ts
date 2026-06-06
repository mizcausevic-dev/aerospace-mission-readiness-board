import { spawnSync } from "node:child_process";

const binaryPath = process.platform === "win32" ? "cpp/mission_score.exe" : "cpp/mission_score";
const executable = process.platform === "win32" ? ".\\cpp\\mission_score.exe" : "./cpp/mission_score";

const compile = spawnSync(
  "clang++",
  ["-std=c++20", "-Wall", "-Wextra", "-pedantic", "cpp/mission_score.cpp", "-o", binaryPath],
  { stdio: "inherit" }
);

if (compile.status !== 0) {
  process.exit(compile.status ?? 1);
}

const run = spawnSync(executable, ["fixtures/mission-readiness.json"], {
  stdio: "inherit"
});

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}

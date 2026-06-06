# Architecture

Aerospace Mission Readiness Board is intentionally small but multi-language:

- `fixtures/mission-readiness.json` stores synthetic mission-readiness lanes.
- `src/index.ts` scores records and produces the public summary.
- `src/app.ts` renders the static HTML surface and local Express route.
- `cpp/mission_score.cpp` simulates an embedded mission-risk scoring lane.
- `crates/mission-normalizer` normalizes mission lanes into readiness events.
- `python/aerospace_mission_board/pack.py` produces board-ready review-pack narratives.

The repo avoids production integrations. Real deployments would replace the fixture with an authenticated ingest path, enforce export-control review, redact sensitive program details, and separate operator telemetry from public-facing readiness narratives.

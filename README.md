# aerospace-mission-readiness-board

[![ci](https://github.com/mizcausevic-dev/aerospace-mission-readiness-board/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/aerospace-mission-readiness-board/actions/workflows/ci.yml)
[![pages](https://github.com/mizcausevic-dev/aerospace-mission-readiness-board/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/aerospace-mission-readiness-board/actions/workflows/pages.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)

Aerospace Mission Readiness Board is an aerospace and defense control-plane prototype for turning launch-window pressure, propulsion anomalies, thermal margin, comms loss, guidance findings, supplier exceptions, and safety waivers into a board-readable mission-readiness ledger.

It is built to create clear portfolio signal across C++, Rust, Python, and TypeScript while staying aligned with the Kinetic Gain pattern: raw operational complexity becomes an evidence-backed decision surface.

## Why this exists

- Aerospace and defense programs fail quietly when mission assurance, supplier exceptions, flight software, and comms telemetry live in separate review packets.
- Operators need one owner-visible view before a launch-readiness review, range review, board update, or investor diligence packet.
- Boards need to know whether a mission is launch-go, watch-only, or hold because evidence gaps are still unresolved.

## What it ships

- C++ embedded-style mission risk scorer for launch and flight-readiness records.
- Rust normalizer that converts mission lanes into readiness events.
- Python readiness-pack generator for board and mission-assurance narratives.
- TypeScript scoring library, tests, CLI, and static web board.
- Synthetic fixtures, docs, screenshots, and GitHub Pages release rail.

## Routes

- `/` - static public board
- `/api/missions` - JSON summary when run locally with Express

## Local run

```powershell
npm install
npm run verify
npm run prerender
npm run smoke
```

## CLI

```powershell
npm run demo
python python/aerospace_mission_board/pack.py fixtures/mission-readiness.json --format markdown
clang++ -std=c++20 cpp/mission_score.cpp -o cpp/mission_score.exe
./cpp/mission_score.exe fixtures/mission-readiness.json
cargo test --manifest-path crates/mission-normalizer/Cargo.toml
```

## Screenshots

![Mission readiness overview](screenshots/01-overview-proof.png)

![Mission exception ledger](screenshots/02-ledger-proof.png)

## Security

This repo uses synthetic mission-readiness data only. Do not commit export-controlled details, mission identifiers from real programs, precise telemetry, safety incident records, customer data, credentials, or production defense data.

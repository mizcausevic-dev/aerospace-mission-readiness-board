import argparse
import json
from pathlib import Path


def _score(mission: dict) -> dict:
    risk = round(
        min(
            100,
            max(0, 30 - mission["launchWindowDays"]) * 0.8
            + mission["propulsionAnomalies"] * 18
            + max(0, 25 - mission["thermalMarginPercent"]) * 1.6
            + mission["commsLossMinutes"] * 0.9
            + mission["guidanceSoftwareFindings"] * 9
            + mission["supplierExceptionCount"] * 8
            + mission["crewSafetyWaivers"] * 12,
        ),
        2,
    )
    readiness = "hold" if risk >= 72 else "watch" if risk >= 38 else "go"
    return {**mission, "missionRiskScore": risk, "readiness": readiness}


def build_pack(input_path: str | Path) -> dict:
    payload = json.loads(Path(input_path).read_text(encoding="utf-8"))
    findings = sorted((_score(mission) for mission in payload["missions"]), key=lambda row: row["missionRiskScore"], reverse=True)
    top = findings[0]
    return {
        "title": "Aerospace Mission Readiness Pack",
        "program": payload["program"],
        "holdMissions": sum(1 for row in findings if row["readiness"] == "hold"),
        "primaryRecommendation": f"{top['missionId']}: {top['nextAction']}",
        "findings": findings,
    }


def _markdown(pack: dict) -> str:
    lines = [
        f"# {pack['title']}",
        "",
        f"Program: {pack['program']}",
        f"Hold missions: {pack['holdMissions']}",
        f"Primary recommendation: {pack['primaryRecommendation']}",
        "",
        "## Findings",
    ]
    for row in pack["findings"]:
        lines.append(f"- {row['missionId']} | {row['readiness']} | risk {row['missionRiskScore']} | owner {row['owner']}")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    args = parser.parse_args()
    pack = build_pack(args.input)
    print(_markdown(pack) if args.format == "markdown" else json.dumps(pack, indent=2))


if __name__ == "__main__":
    main()

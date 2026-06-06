use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RawMission {
    pub mission_id: String,
    pub mission: String,
    pub launch_window_days: u32,
    pub propulsion_anomalies: u32,
    pub thermal_margin_percent: f64,
    pub comms_loss_minutes: u32,
    pub guidance_software_findings: u32,
    pub supplier_exception_count: u32,
    pub crew_safety_waivers: u32,
    pub owner: String,
    pub next_action: String,
}

#[derive(Debug, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct NormalizedMission {
    pub mission_id: String,
    pub mission: String,
    pub exception_pressure: f64,
    pub readiness: String,
    pub owner: String,
}

pub fn normalize(mission: RawMission) -> NormalizedMission {
    let exception_pressure = (30_u32.saturating_sub(mission.launch_window_days) as f64 * 0.8)
        + mission.propulsion_anomalies as f64 * 18.0
        + (25.0 - mission.thermal_margin_percent).max(0.0) * 1.6
        + mission.comms_loss_minutes as f64 * 0.9
        + mission.guidance_software_findings as f64 * 9.0
        + mission.supplier_exception_count as f64 * 8.0
        + mission.crew_safety_waivers as f64 * 12.0;
    let readiness = if exception_pressure >= 72.0 {
        "hold"
    } else if exception_pressure >= 38.0 {
        "watch"
    } else {
        "go"
    };

    NormalizedMission {
        mission_id: mission.mission_id,
        mission: mission.mission,
        exception_pressure: (exception_pressure * 100.0).round() / 100.0,
        readiness: readiness.to_string(),
        owner: mission.owner,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalizes_hold_mission() {
        let mission = RawMission {
            mission_id: "ORBITAL-DAWN-4".into(),
            mission: "smallsat launch and first-orbit checkout".into(),
            launch_window_days: 9,
            propulsion_anomalies: 2,
            thermal_margin_percent: 11.0,
            comms_loss_minutes: 18,
            guidance_software_findings: 4,
            supplier_exception_count: 3,
            crew_safety_waivers: 1,
            owner: "Mission assurance".into(),
            next_action: "hold".into(),
        };
        let normalized = normalize(mission);
        assert_eq!(normalized.readiness, "hold");
        assert!(normalized.exception_pressure > 100.0);
    }
}

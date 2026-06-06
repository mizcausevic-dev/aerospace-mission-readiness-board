#include <fstream>
#include <iostream>
#include <regex>
#include <string>

double sum_field(const std::string& json, const std::string& field) {
    const std::regex pattern("\"" + field + "\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)");
    double total = 0.0;
    for (std::sregex_iterator it(json.begin(), json.end(), pattern), end; it != end; ++it) {
        total += std::stod((*it)[1].str());
    }
    return total;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "usage: mission_score <mission-readiness.json>\n";
        return 2;
    }

    std::ifstream file(argv[1]);
    if (!file) {
        std::cerr << "unable to read input\n";
        return 2;
    }

    const std::string json((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    const double launch_pressure = sum_field(json, "launchWindowDays");
    const double propulsion = sum_field(json, "propulsionAnomalies");
    const double thermal_margin = sum_field(json, "thermalMarginPercent");
    const double comms = sum_field(json, "commsLossMinutes");
    const double guidance = sum_field(json, "guidanceSoftwareFindings");
    const double suppliers = sum_field(json, "supplierExceptionCount");
    const double waivers = sum_field(json, "crewSafetyWaivers");
    const double score = launch_pressure * 0.8 + propulsion * 18.0 + (75.0 - thermal_margin) * 1.1 + comms * 0.9 + guidance * 9.0 + suppliers * 8.0 + waivers * 12.0;

    std::cout << "mission_readiness_score=" << score << "\n";
    if (score <= 0.0) {
        return 1;
    }
    return 0;
}

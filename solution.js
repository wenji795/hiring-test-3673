const https = require("https");

const API_KEY = "h523hDtETbkJ3nSJL323hjYLXbCyDaRZ";
const BASE_URL = "https://api.recruitment.shq.nz";

function getDomains(clientId) {
    const url = `${BASE_URL}/domains/${clientId}?api_key=${API_KEY}`;
    https.get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            const domains = JSON.parse(data);
            domains.forEach((domain) => {
                console.log(`Domain: ${domain.name}`);
                domain.zones.forEach((zone) => {
                    console.log("ZONE RAW DATA:", zone);
                    const zoneId = zone.uri ? zone.uri.split("/").pop() : "unknown";
                    console.log(`Zone: ${zone.name} (ID: ${zoneId})`);
                    if (zoneId !== "unknown") {
                        getZoneRecords(zoneId);
                    }
                });
            });
        });
    }).on("error", (err) => {
        console.error("Error:", err.message);
    });
}


function getZoneRecords(zoneId) {
    const url = `${BASE_URL}/zones/${zoneId}?api_key=${API_KEY}`;
    https.get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            let json;
            try {
                json = JSON.parse(data);
            } catch (err) {
                console.error("Invalid JSON:", data);
                return;
            }

            const records = Array.isArray(json) ? json : json.records || [];
            if (!records.length) {
                console.log("no records");
                return;
            }

            records.forEach((record) => {
                console.log(`[${record.type}] ${record.name} -> ${record.data} (TTL: ${record.ttl})`);
            });
        });
    }).on("error", (err) => {
        console.error("Error:", err.message);
    });
}

getDomains(100);

const https = require("https");
const fs = require("fs");
const path = require("path");

/**
 * Usage
 * -----
 * AIRTABLE_API_KEY=your_token node scripts/refresh-snapshot.js
 * Optional: set AIRTABLE_BASE_ID if you're using a different base.
 */

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID || "appRkIddAFC3p5eqv";

if (!apiKey) {
  console.error("🚫 Please set AIRTABLE_API_KEY before running this script.");
  process.exit(1);
}

const tableMap = [
  { key: "jobs", table: "Jobs" },
  { key: "businesses", table: "Directory" },
  { key: "deals", table: "Deals" },
  { key: "tips", table: "SideHustleTips" },
  { key: "news", table: "News" },
  { key: "events", table: "Events" }
];

function fetchAllRecords(tableName) {
  const headers = {
    Authorization: `Bearer ${apiKey}`
  };

  return new Promise((resolve, reject) => {
    const records = [];

    function requestPage(offset) {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
      url.searchParams.set("pageSize", "100");
      if (offset) {
        url.searchParams.set("offset", offset);
      }

      const req = https.request(
        url,
        {
          method: "GET",
          headers
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            if (res.statusCode !== 200) {
              return reject(new Error(`Airtable ${tableName} responded ${res.statusCode}: ${body}`));
            }
            let parsed;
            try {
              parsed = JSON.parse(body);
            } catch (err) {
              return reject(err);
            }
            if (Array.isArray(parsed.records)) {
              parsed.records.forEach((record) => {
                records.push({ ...record.fields, _createdTime: record.createdTime });
              });
            }
            if (parsed.offset) {
              requestPage(parsed.offset);
            } else {
              resolve(records);
            }
          });
        }
      );

      req.on("error", reject);
      req.end();
    }

    requestPage();
  });
}

async function main() {
  const snapshot = {};
  for (const entry of tableMap) {
    console.log(`Fetching ${entry.table}...`);
    snapshot[entry.key] = await fetchAllRecords(entry.table);
  }

  const targetPath = path.join(__dirname, "..", "data-snapshot.json");
  fs.writeFileSync(targetPath, JSON.stringify(snapshot, null, 2) + "\n", "utf-8");
  console.log(`✅ Snapshot refreshed at ${targetPath}`);
}

main().catch((error) => {
  console.error("Snapshot refresh failed", error);
  process.exit(1);
});

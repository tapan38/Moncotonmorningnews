const fs = require("fs");
const path = require("path");

const targetPath = path.join(__dirname, "airtable-config.js");
const apiKey = process.env.AIRTABLE_API_KEY || "";
const baseId = process.env.AIRTABLE_BASE_ID || "appRkIddAFC3p5eqv";

const config = {
  airtableApiKey: apiKey,
  baseId
};

fs.writeFileSync(targetPath, `window.MONCTON_CONFIG = ${JSON.stringify(config, null, 2)};\n`, "utf-8");

console.log("✅ Airtable config written for Netlify build");

import { AIRTABLE_CONFIG } from "../config.js";
import { MOCK_DATA } from "./mockData.js";

const headers = AIRTABLE_CONFIG.apiKey
  ? {
      Authorization: `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      "Content-Type": "application/json"
    }
  : null;

const baseUrl = "https://api.airtable.com/v0/";

function normalizeTable(tableName) {
  return tableName;
}

export const useAirtableApi = Boolean(AIRTABLE_CONFIG.apiKey && AIRTABLE_CONFIG.baseId);

export async function fetchTable(tableName, view = "") {
  if (!useAirtableApi) {
    return MOCK_DATA[normalizeTable(tableName)] ?? [];
  }

  const encodedTable = encodeURIComponent(normalizeTable(tableName));
  const params = new URLSearchParams({ pageSize: "100" });
  if (view) {
    params.set("view", view);
  }

  const response = await fetch(`${baseUrl}${AIRTABLE_CONFIG.baseId}/${encodedTable}?${params.toString()}`, {
    headers
  });

  if (!response.ok) {
    console.error("Airtable fetch failed", tableName, await response.text());
    return MOCK_DATA[normalizeTable(tableName)] ?? [];
  }

  const payload = await response.json();
  return payload.records.map((record) => record.fields);
}

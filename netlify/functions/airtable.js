// Functionality related to Airtable

const endpoint = "https://api.airtable.com/v0/appRkIddAFC3p5eqv/";
const apiKey = process.env.AIRTABLE_API_KEY;

async function fetchDataFromAirtable() {
    const response = await fetch(`${endpoint}YourTableName`, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json();
    return data;
}

module.exports = { fetchDataFromAirtable };
export async function callAirtable(options) {
    try {
        const response = await fetch('/.netlify/functions/airtable', options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling Airtable function:', error);
    }
}
const handler = async (event) => {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const endpoint = 'TODO: Your AirTable endpoint URL';

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };

    try {
        let response;
        if (event.httpMethod === 'GET') {
            response = await fetch(endpoint, { method: 'GET', headers });
        } else if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
        } else {
            return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
        }

        const data = await response.json();
        return {
            statusCode: response.ok ? 200 : response.status,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

exports.handler = handler;
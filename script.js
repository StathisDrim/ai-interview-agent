const https = require('https');

module.exports = async (req, res) => {
    // 1. CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    // 2. Το JSON που στέλνουμε στην Google
    const postData = JSON.stringify({
        contents: [{ parts: [{ text: `Είσαι ο Στάθης (15/12/1992), Warehouse Specialist. Απάντα σύντομα.\n\nΕρώτηση: ${question}` }] }]
    });

    // 3. Ρυθμίσεις αιτήματος (Χρησιμοποιούμε v1beta που είναι η πιο σίγουρη)
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    // 4. Εκτέλεση με το παλιό καλό https module (δεν κολλάει ποτέ στο Vercel)
    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.candidates && json.candidates[0].content) {
                    const reply = json.candidates[0].content.parts[0].text;
                    res.status(200).json({ reply });
                } else {
                    res.status(200).json({ reply: "Σφάλμα AI: " + (json.error ? json.error.message : "Άγνωστο θέμα") });
                }
            } catch (e) {
                res.status(500).json({ error: "Parse Error" });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    request.write(postData);
    request.end();
};

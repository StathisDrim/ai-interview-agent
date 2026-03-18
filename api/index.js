const https = require('https');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    const postData = JSON.stringify({
        contents: [{ parts: [{ text: `Είσαι ο Στάθης (15/12/1992), Warehouse Specialist. Απάντα σύντομα.\n\nΕρώτηση: ${question}` }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        // ΤΟ URL ΠΟΥ ΔΟΥΛΕΥΕΙ ΣΤΑ ΠΕΡΙΣΣΟΤΕΡΑ NEW PROJECTS:
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                const json = JSON.parse(data);
                
                if (json.error) {
                    return res.status(200).json({ reply: `Σφάλμα Google (${json.error.code}): ${json.error.message}` });
                }

                if (json.candidates && json.candidates[0].content) {
                    const reply = json.candidates[0].content.parts[0].text;
                    res.status(200).json({ reply });
                } else {
                    res.status(200).json({ reply: "Δεν βρέθηκε απάντηση. Δοκίμασε ξανά." });
                }
            } catch (e) {
                res.status(200).json({ reply: "Σφάλμα λήψης: " + data });
            }
        });
    });

    request.on('error', (e) => {
        res.status(200).json({ reply: "Σφάλμα δικτύου: " + e.message });
    });

    request.write(postData);
    request.end();
};

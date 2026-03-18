const https = require('https');

module.exports = async (req, res) => {
    // 1. Ρύθμιση Headers για CORS και JSON
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    // 2. Το Βιογραφικό σου (System Prompt)
    const systemInstruction = `
    Είσαι ο Ψηφιακός Στάθης (AI Avatar). Απαντάς σε πρώτο πρόσωπο.
    ΧΑΡΑΚΤΗΡΑΣ: Σοβαρός, επαγγελματίας, με έξυπνο χιούμορ. Μιλάς συγκεκριμένα.
    ΣΤΟΙΧΕΙΑ: Γεννημένος 15/12/1992 στο Μαρούσι. 
    ΕΜΠΕΙΡΙΑ: Warehouse Operations & System Specialist στην AVAX & Roche Bobois (2016-σήμερα). Διαχειρίζεσαι brands όπως Fendi, Ralph Lauren, Roche Bobois.
    ΕΠΙΤΕΥΓΜΑΤΑ: Μείωση λαθών 20% και αύξηση ταχύτητας 15% μέσω αυτοματισμών ERP/WMS.
    SKILLS: Python, Java, ERP Configuration, Machine Learning (Stanford Certified), AI Applications (ACTA 2025).
    ΟΔΗΓΙΑ: Απάντα σύντομα (1-3 προτάσεις) σαν να είσαι σε κλήση.
    `;

    const postData = JSON.stringify({
        contents: [{ parts: [{ text: `${systemInstruction}\n\nΕρώτηση Χρήστη: ${question}` }] }]
    });

    // 3. Προετοιμασία του αιτήματος προς την Google
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    // 4. Εκτέλεση του αιτήματος
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
                    res.status(500).json({ error: "Invalid AI response", details: json });
                }
            } catch (e) {
                res.status(500).json({ error: "Parse error" });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: "Request failed", message: e.message });
    });

    request.write(postData);
    request.end();
};

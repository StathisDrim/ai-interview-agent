module.exports = async (req, res) => {
    // Headers για να μην κόβει το Vercel την επικοινωνία
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    // Το prompt σου
    const systemInstruction = "Είσαι ο Στάθης (15/12/1992), ειδικός σε ERP/WMS. Απάντα σύντομα.";

    try {
        // ΠΡΟΣΟΧΗ ΣΤΟ URL: Χρησιμοποιούμε v1/models/gemini-1.5-flash:generateContent
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nΕρώτηση: ${question}` }] }]
            })
        });

        const data = await response.json();

        // Έλεγχος αν η Google έστειλε error
        if (data.error) {
            return res.status(data.error.code || 500).json({ 
                error: "Google API Error", 
                message: data.error.message 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(500).json({ error: "No candidates found", details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server Crash", message: error.message });
    }
};

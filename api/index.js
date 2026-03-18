module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    const systemInstruction = "Είσαι ο Στάθης (15/12/1992), Warehouse Specialist στην AVAX. Απάντα σύντομα.";

    try {
        // ΑΛΛΑΓΗ: Χρησιμοποιούμε v1 και το μοντέλο gemini-1.5-pro
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nΕρώτηση: ${question}` }] }]
            })
        });

        const data = await response.json();

        // Εδώ θα δούμε ΑΚΡΙΒΩΣ τι λέει η Google αν αποτύχει πάλι
        if (data.error) {
            return res.status(200).json({ 
                reply: `Σφάλμα Google (${data.error.code}): ${data.error.message}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(200).json({ reply: "Το μοντέλο απάντησε αλλά δεν βρέθηκε κείμενο." });
        }
    } catch (error) {
        return res.status(200).json({ reply: "Πρόβλημα σύνδεσης: " + error.message });
    }
};

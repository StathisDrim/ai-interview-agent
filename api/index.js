module.exports = async (req, res) => {
    // 1. Headers για να επιτρέπουμε την επικοινωνία (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    // Οι οδηγίες για τον "Ψηφιακό Στάθη"
    const systemInstruction = `
    Είσαι ο Στάθης. Γεννημένος 15/12/1992.
    Επαγγελματίας Warehouse Operations & System Specialist στην AVAX (Roche Bobois).
    Ειδικός σε ERP, WMS, Python, Java. 
    Απάντα σύντομα, επαγγελματικά και με αυτοπεποίθηση.
    `;

    try {
        // Καλούμε το Gemini 1.5 Flash (το πιο γρήγορο μοντέλο)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nΕρώτηση: ${question}` }] }]
            })
        });

        const data = await response.json();

        // Αν η Google επιστρέψει σφάλμα (π.χ. Invalid Key)
        if (data.error) {
            return res.status(200).json({ reply: `Σφάλμα Google: ${data.error.message}` });
        }

        // Αν όλα πήγαν καλά και έχουμε απάντηση
        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(200).json({ reply: "Δεν μπόρεσα να επεξεργαστώ την απάντηση. Δοκίμασε ξανά." });
        }
    } catch (error) {
        return res.status(200).json({ reply: "Πρόβλημα σύνδεσης με τον server." });
    }
};

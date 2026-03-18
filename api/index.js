module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    const systemInstruction = "Είσαι ο Στάθης (15/12/1992), ειδικός σε ERP/WMS. Απάντα σύντομα.";

    try {
        // Η ΠΙΟ ΑΠΛΗ ΜΟΡΦΗ URL (Χωρίς v1 ή v1beta στο εσωτερικό του path)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `${systemInstruction}\n\nΕρώτηση: ${question}` }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Εδώ θα μας πει αν το κλειδί είναι λάθος ή αν το μοντέλο θέλει άλλο όνομα
            return res.status(200).json({ 
                reply: `Google Error ${data.error.code}: ${data.error.message}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(200).json({ reply: "Δεν βρέθηκε απάντηση. Δοκίμασε ξανά." });
        }
    } catch (error) {
        return res.status(200).json({ reply: "Σφάλμα συστήματος: " + error.message });
    }
};

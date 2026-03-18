export default async function handler(req, res) {
    // Εδώ το Vercel τραβάει το κλειδί από τις ρυθμίσεις (Environment Variables)
    // και ΔΕΝ φαίνεται στον χρήστη!
    const API_KEY = process.env.GEMINI_KEY; 
    const { question } = req.body;

    // Εδώ θα βάλουμε αργότερα τις πληροφορίες σου
    const systemInstruction = "Είσαι ο Στάθης, ένας developer. Απάντα σύντομα και φιλικά.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nΕρώτηση: ${question}` }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ error: "Κάτι πήγε στραβά με το API" });
    }
}

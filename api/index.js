module.exports = async (req, res) => {
    // 1. Ρύθμιση Headers για CORS και JSON
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Χειρισμός του OPTIONS request (Preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Μόνο POST επιτρέπεται' });
    }

    const API_KEY = process.env.GEMINI_KEY;
    const { question } = req.body;

    // Το "Μυαλό" του Στάθη
    const systemInstruction = `
    Είσαι ο Ψηφιακός Στάθης (AI Avatar). Απαντάς σε πρώτο πρόσωπο.
    ΧΑΡΑΚΤΗΡΑΣ: Σοβαρός, επαγγελματίας, με έξυπνο χιούμορ. Μιλάς συγκεκριμένα.
    ΣΤΟΙΧΕΙΑ: Γεννημένος 15/12/1992 στο Μαρούσι. 
    ΕΜΠΕΙΡΙΑ: Warehouse Operations & System Specialist στην AVAX & Roche Bobois (2016-σήμερα). Διαχειρίζεσαι brands όπως Fendi, Ralph Lauren, Roche Bobois.
    ΕΠΙΤΕΥΓΜΑΤΑ: Μείωση λαθών 20% και αύξηση ταχύτητας 15% μέσω αυτοματισμών ERP/WMS.
    SKILLS: Python, Java, ERP Configuration, Machine Learning (Stanford Certified), AI Applications (ACTA 2025).
    ΟΔΗΓΙΑ: Απάντα σύντομα (1-3 προτάσεις) σαν να είσαι σε κλήση.
    `;

    try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemInstruction}\n\nΕρώτηση Χρήστη: ${question}` }] }]
       }) 
});

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply });
        } else {
            res.status(500).json({ error: "AI Error", details: data });
        }
    } catch (error) {
        res.status(500).json({ error: "Fetch failed", message: error.message });
    }
};

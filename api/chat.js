export default async function handler(req, res) {
    // 1. Επιτρέπουμε στο GitHub Pages να "μιλάει" με το Vercel (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Έλεγχος αν η κλήση είναι POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // ΑΛΛΑΓΗ ΣΕ MISTRAL (Πιο σταθερό για free tier)
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `Είσαι ο Στάθης, ένας έμπειρος αποθηκάριος. Απάντα σύντομα στα ελληνικά στην ερώτηση: ${req.body.inputs}`,
                parameters: { max_new_tokens: 100, wait_for_model: true }
                }
            }),
        });

        const data = await hfResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}

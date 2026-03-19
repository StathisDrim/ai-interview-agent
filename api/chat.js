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
        const hfResponse = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: req.body.inputs,
                parameters: { 
                    max_new_tokens: 150,
                    return_full_text: false,
                    wait_for_model: true // Αναγκάζει το AI να ξυπνήσει αν κοιμάται
                }
            }),
        });

        const data = await hfResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}

export default async function handler(req, res) {
    // CORS Headers για να επιτρέπεται η κλήση από το GitHub
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const hfResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `<s>[INST] Είσαι ο Στάθης, ένας έμπειρος Warehouse Specialist. Απάντα σύντομα, φιλικά και επαγγελματικά στα ελληνικά στην εξής ερώτηση: ${req.body.inputs} [/INST]`,
                parameters: { 
                    max_new_tokens: 150,
                    return_full_text: false,
                    wait_for_model: true 
                }
            }),
        });

        const data = await hfResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}

export default async function handler(req, res) {
    // Επιτρέπουμε στο site σου να μιλάει με το Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    // Checkpoint 1: Λείπει το Token;
    if (!HF_TOKEN) {
        console.error("ΣΦΑΛΜΑ 1: Δεν βρέθηκε το HF_TOKEN στο Vercel.");
        return res.status(500).json({ error: "Λείπει το HF_TOKEN από το Vercel" });
    }

    try {
        const userMessage = req.body.inputs || "";
        console.log("Checkpoint 2: Έλαβα μήνυμα από το site:", userMessage);

        const hfResponse = await fetch("https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `<s>[INST] Είσαι ο Στάθης, ένας έμπειρος Warehouse Specialist. Απάντα φιλικά και σύντομα στα ελληνικά: ${userMessage} [/INST]`,
                parameters: { max_new_tokens: 150, wait_for_model: true }
            }),
        });

        console.log("Checkpoint 3: HTTP Status από Hugging Face:", hfResponse.status);

        const data = await hfResponse.json();
        console.log("Checkpoint 4: Απάντηση από Hugging Face:", JSON.stringify(data));

        // Αν το Hugging Face σκάσει, στέλνουμε το σφάλμα κατευθείαν στην οθόνη σου
        if (!hfResponse.ok) {
            return res.status(hfResponse.status).json({ error: "Hugging Face Error", details: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("ΣΦΑΛΜΑ VERCEL:", error.message);
        return res.status(500).json({ error: "Vercel Crash", details: error.message });
    }
}

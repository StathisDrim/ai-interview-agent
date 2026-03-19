export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // ΕΔΩ ΤΟΥ ΔΙΝΟΥΜΕ ΠΛΗΡΟΦΟΡΙΕΣ (PROMPT) ΓΙΑ ΝΑ ΕΧΕΙ ΤΙ ΝΑ ΠΕΙ
                inputs: `<s>[INST] Είσαι ο Στάθης, ένας έμπειρος Warehouse Specialist με γνώσεις σε συστήματα αποθήκης (WMS/SAP) και διαχείριση αποθεμάτων. Απάντα σύντομα και επαγγελματικά στα ελληνικά: ${req.body.inputs} [/INST]`,
                parameters: { max_new_tokens: 100, wait_for_model: true }
            }),
        });

        const data = await response.json();
        
        // ΑΥΤΟ ΕΙΝΑΙ ΤΟ LOG ΠΟΥ ΘΑ ΔΕΙΣ ΣΤΟ VERCEL
        console.log("AI Response Raw Data:", JSON.stringify(data));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error("Vercel Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
}

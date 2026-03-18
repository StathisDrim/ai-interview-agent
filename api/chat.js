export default async function handler(req, res) {
    // CORS HEADERS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ΠΑΙΡΝΟΥΜΕ ΤΟ ΚΛΕΙΔΙ
    const HF_TOKEN = process.env.HF_TOKEN;

    // ΕΛΕΓΧΟΣ ΑΝ ΤΟ ΚΛΕΙΔΙ ΥΠΑΡΧΕΙ
    if (!HF_TOKEN || HF_TOKEN === "") {
        return res.status(500).json({ 
            error: "Λείπει το HF_TOKEN!", 
            details: "Πήγαινε στο Vercel Dashboard -> Settings -> Environment Variables και πρόσθεσε το HF_TOKEN." 
        });
    }

    try {
        const response = await fetch("https://router.huggingface.co/hf-inference/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}

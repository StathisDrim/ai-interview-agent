export default async function handler(req, res) {
    // Headers για CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Μόνο POST επιτρέπεται' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    // Έλεγχος αν υπάρχει το κλειδί
    if (!HF_TOKEN) {
        return res.status(500).json({ error: "Λείπει το HF_TOKEN από το Vercel Environment Variables" });
    }

    try {
        const hfResponse = await fetch("https://router.huggingface.co/hf-inference/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await hfResponse.json();

        if (!hfResponse.ok) {
            return res.status(hfResponse.status).json({ error: "Hugging Face Error", details: data });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}

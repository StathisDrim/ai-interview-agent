export default async function handler(req, res) {
    // 1. ΡΥΘΜΙΣΗ CORS ΓΙΑ ΝΑ ΕΠΙΤΡΕΠΕΤΑΙ ΤΟ GITHUB
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Επιτρέπει σε όλα τα sites να σε καλούν
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // Χειρισμός του Preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
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
        return res.status(500).json({ error: "Server Error: " + error.message });
    }
}

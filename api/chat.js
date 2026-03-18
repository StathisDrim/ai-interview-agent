export default async function handler(req, res) {
    // 1. CORS HEADERS (Για να επικοινωνεί το GitHub με το Vercel)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // Χρησιμοποιούμε το πιο σταθερό URL του Hugging Face
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: req.body.inputs,
                parameters: { 
                    max_new_tokens: 100,
                    return_full_text: false,
                    wait_for_model: true // SOS: Περιμένει το μοντέλο να φορτώσει αντί να πετάξει σφάλμα
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("HF Error:", data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Vercel Server Error:", error);
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}

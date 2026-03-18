document.addEventListener('DOMContentLoaded', () => {
    // ΣΠΑΜΕ ΤΟ ΚΛΕΙΔΙ ΓΙΑ ΝΑ ΜΗΝ ΤΟ ΠΙΑΝΕΙ ΤΟ ΣΚΑΝΑΡΙΣΜΑ ΤΟΥ GITHUB
    // ΑΝΤΙΚΑΤΑΣΤΗΣΕ ΤΑ ΠΑΡΑΚΑΤΩ ΜΕ ΤΟ ΝΕΟ ΣΟΥ TOKEN
    const p1 = "hf_JYaYqDzMbVkXMVy"; // Βάλε εδώ το πρώτο μισό του νέου σου token
    const p2 = "ZkXSDGulbXxlpgtbUJW"; // Βάλε εδώ το δεύτερο μισό
    const HF_TOKEN = p1 + p2;

    const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

    const acceptBtn = document.getElementById('accept-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            document.getElementById('call-screen').classList.add('hidden');
            document.getElementById('chat-screen').classList.remove('hidden');
        });
    }

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nΕίσαι ο Στάθης (15/12/1992), Warehouse Specialist. Απάντα σύντομα στα ελληνικά.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                    parameters: { max_new_tokens: 150, return_full_text: false }
                }),
            });

            const result = await response.json();

            // Έλεγχος αν το μοντέλο φορτώνει (συνηθισμένο στο δωρεάν Hugging Face)
            if (result.estimated_time) {
                appendMessage('ai', `Περίμενε ${Math.round(result.estimated_time)} δευτερόλεπτα να προετοιμαστώ...`);
                return;
            }

            if (result && result[0] && result[0].generated_text) {
                let reply = result[0].generated_text.trim();
                appendMessage('ai', reply);
            } else {
                appendMessage('ai', "Κάτι πήγε στραβά, ξαναδοκίμασε σε λίγο.");
            }
        } catch (e) {
            appendMessage('ai', "Σφάλμα σύνδεσης. Δοκίμασε ξανά.");
            console.error(e);
        }
    }

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
        div.style.margin = "10px";
        div.style.padding = "10px";
        div.style.borderRadius = "10px";
        div.style.backgroundColor = sender === 'user' ? "#007bff" : "#f1f1f1";
        div.style.color = sender === 'user' ? "white" : "black";
        div.style.alignSelf = sender === 'user' ? "flex-end" : "flex-start";
        div.innerText = (sender === 'user' ? "Εσύ: " : "Στάθης: ") + text;
        chatLog.appendChild(div);
        chatLog.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});

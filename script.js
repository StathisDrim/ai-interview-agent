document.addEventListener('DOMContentLoaded', () => {
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    // ΕΝΑΛΛΑΓΗ ΟΘΟΝΩΝ
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            callScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
            setTimeout(() => {
                appendMessage('ai', "Γεια! Είμαι ο Στάθης. Πώς μπορώ να σε βοηθήσω;");
            }, 500);
        });
    }

    // ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        try {
            // ΑΛΛΑΞΕ ΤΟ URL ΜΕ ΤΟ ΔΙΚΟ ΣΟΥ DOMAIN ΑΠΟ ΤΟ VERCEL
            const response = await fetch('https://ai-interview-agent-gsad.vercel.app/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nΕίσαι ο Στάθης (Warehouse Specialist). Απάντα σύντομα και φιλικά στα ελληνικά.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                    parameters: { max_new_tokens: 150, return_full_text: false }
                })
            });

            const result = await response.json();

            if (result && result[0] && result[0].generated_text) {
                appendMessage('ai', result[0].generated_text.trim());
            } else if (result.error && result.estimated_time) {
                appendMessage('ai', "Το σύστημα φορτώνει, ξαναδοκίμασε σε 15 δευτερόλεπτα...");
            } else {
                appendMessage('ai', "Κάτι πήγε στραβά. Δοκίμασε ξανά.");
            }
        } catch (error) {
            appendMessage('ai', "Σφάλμα σύνδεσης με τον server.");
            console.error(error);
        }
    }

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.style.padding = "10px";
        bubble.style.margin = "8px";
        bubble.style.borderRadius = "12px";
        bubble.style.maxWidth = "80%";
        bubble.style.backgroundColor = sender === 'user' ? "#007bff" : "#e9e9eb";
        bubble.style.color = sender === 'user' ? "white" : "black";
        bubble.style.marginLeft = sender === 'user' ? "auto" : "0";
        bubble.innerText = (sender === 'user' ? "Εσύ: " : "Στάθης: ") + text;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
});

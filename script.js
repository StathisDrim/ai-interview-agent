document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatLog = document.getElementById('chat-log');
    const acceptBtn = document.getElementById('accept-btn');
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');

    const VERCEL_URL = 'https://ai-interview-agent-37ob.vercel.app/api/chat';

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            callScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
            appendMessage('ai', "Γεια! Είμαι ο ψηφιακός Στάθης. Πώς μπορώ να σε βοηθήσω;");
        });
    }

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        try {
            const response = await fetch(VERCEL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: text })
            });

            const result = await response.json();

            if (response.ok) {
                let reply = "";
                // Το Mistral επιστρέφει συνήθως [{ generated_text: "..." }]
                if (Array.isArray(result) && result[0].generated_text) {
                    reply = result[0].generated_text;
                } else if (result.generated_text) {
                    reply = result.generated_text;
                } else {
                    reply = "Δεν βρέθηκε απάντηση. Δοκίμασε ξανά.";
                }
                appendMessage('ai', reply);
            } else {
                appendMessage('ai', "Το AI ετοιμάζεται... Ξαναστείλε σε 5 δευτερόλεπτα!");
            }
        } catch (e) {
            appendMessage('ai', "Σφάλμα σύνδεσης.");
        }
    }

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.style.padding = "10px";
        bubble.style.margin = "8px";
        bubble.style.borderRadius = "12px";
        bubble.style.maxWidth = "80%";
        bubble.style.fontFamily = "sans-serif";
        
        if (sender === 'user') {
            bubble.style.backgroundColor = "#007bff";
            bubble.style.color = "white";
            bubble.style.marginLeft = "auto";
            bubble.innerText = "Εσύ: " + text;
        } else {
            bubble.style.backgroundColor = "#e9e9eb";
            bubble.style.color = "#333";
            bubble.style.marginRight = "auto";
            bubble.innerText = "Στάθης: " + text;
        }
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
});

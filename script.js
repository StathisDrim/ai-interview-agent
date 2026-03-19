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
                if (Array.isArray(result) && result[0].generated_text) {
                    reply = result[0].generated_text;
                } else if (result.generated_text) {
                    reply = result.generated_text;
                } else {
                    reply = "Έλαβα απάντηση αλλά η μορφή δεν είναι σωστή.";
                }
                appendMessage('ai', reply);
            } else {
                appendMessage('ai', "Το AI φορτώνει... Ξαναδοκίμασε σε λίγο.");
            }
        } catch (error) {
            console.error("Error:", error);
            appendMessage('ai', "Σφάλμα σύνδεσης με τον server.");
        }
    }

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
        bubble.style.padding = "10px";
        bubble.style.margin = "5px";
        bubble.style.borderRadius = "10px";
        bubble.style.backgroundColor = sender === 'user' ? '#007bff' : '#eee';
        bubble.style.color = sender === 'user' ? 'white' : 'black';
        bubble.innerText = (sender === 'user' ? "Εσύ: " : "Στάθης: ") + text;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});

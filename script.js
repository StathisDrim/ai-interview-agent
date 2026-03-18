document.addEventListener('DOMContentLoaded', () => {
    // --- ΡΥΘΜΙΣΕΙΣ ---
    const API_KEY = "AIzaSyDc9cwD46Jc-C0cK9ZVlgg8b1pgBHGjzG0"; // ΤΟ ΚΛΕΙΔΙ ΣΟΥ
    const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatLog = document.getElementById('chat-log');

    // 1. ΕΝΑΛΛΑΓΗ ΟΘΟΝΩΝ
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            callScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
        });
    }

    // 2. ΛΕΙΤΟΥΡΓΙΑ CHAT (Direct to Google)
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        try {
            const response = await fetch(MODEL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Είσαι ο Στάθης (15/12/1992), Warehouse Specialist. Απάντα σύντομα.\n\nΕρώτηση: ${text}` }] }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                const reply = data.candidates[0].content.parts[0].text;
                typeWriter(reply);
            } else {
                appendMessage('ai', "Σφάλμα Google: " + (data.error ? data.error.message : "Πρόβλημα σύνδεσης"));
            }
        } catch (error) {
            appendMessage('ai', "Σφάλμα: " + error.message);
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
        bubble.innerText = text;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function typeWriter(text) {
        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble';
        chatLog.appendChild(bubble);
        let i = 0;
        function type() {
            if (i < text.length) {
                bubble.innerText += text.charAt(i);
                i++;
                chatLog.scrollTop = chatLog.scrollHeight;
                setTimeout(type, 20);
            }
        }
        type();
    }
});

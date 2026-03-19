const VERCEL_URL = '/api/chat';

document.addEventListener('DOMContentLoaded', () => {
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    // Εμφάνιση Chat
    if (acceptBtn) {
        acceptBtn.onclick = () => {
            callScreen.style.display = 'none';
            chatScreen.classList.remove('hidden');
            chatScreen.style.display = 'flex';
        };
    }

    // Αποστολή Μηνύματος
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMsg('user', text);
        userInput.value = '';

        try {
            const res = await fetch(VERCEL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: text })
            });
            const data = await res.json();
            
            let reply = data[0]?.generated_text || data.generated_text || "Σφάλμα απάντησης";
            if (reply.includes('[/INST]')) reply = reply.split('[/INST]').pop().trim();
            
            appendMsg('stathis', reply);
        } catch (e) {
            appendMsg('stathis', "🔴 Αποτυχία σύνδεσης.");
        }
    }

    function appendMsg(sender, text) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = `<strong>${sender === 'user' ? 'Εσύ' : 'Στάθης'}:</strong> ${text}`;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    if (sendBtn) sendBtn.onclick = sendMessage;
    if (userInput) userInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
});

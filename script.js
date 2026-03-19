// Το σωστό URL του Vercel
const VERCEL_URL = 'https://ai-interview-agent-sooty.vercel.app/api/chat';

document.addEventListener('DOMContentLoaded', () => {
    // Στοιχεία του UI
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatLog = document.getElementById('chat-log');

    // 1. Χειρισμός Οθόνης Κλήσης (Accept Button)
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            if (callScreen && chatScreen) {
                callScreen.classList.add('hidden'); // Κρύβει την κλήση
                chatScreen.classList.remove('hidden'); // Εμφανίζει το chat
                userInput.focus(); // Βάζει τον κέρσορα στο input
            }
        });
    }

    // 2. Αποστολή Μηνύματος (handleSend)
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return; // Μην στέλνεις κενά μηνύματα

        appendMessage('user', text);
        userInput.value = ''; // Καθαρίζει το πεδίο

        try {
            // Κλήση στο API του Vercel
            const response = await fetch(VERCEL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: text })
            });

            const result = await response.json();

            if (response.ok) {
                let reply = "Δεν μπόρεσα να διαβάσω την απάντηση.";
                if (Array.isArray(result) && result[0].generated_text) {
                    reply = result[0].generated_text;
                } else if (result.generated_text) {
                    reply = result.generated_text;
                }
                
                // Καθαρίζει την απάντηση από τυχόν prompt tags ([/INST])
                if (reply.includes('[/INST]')) {
                    reply = reply.split('[/INST]').pop().trim();
                }
                
                appendMessage('ai', reply);
            } else {
                appendMessage('ai', `🔴 Σφάλμα API (${response.status}): ${JSON.stringify(result)}`);
            }
        } catch (error) {
            appendMessage('ai', `🔴 Αποτυχία σύνδεσης: Δεν μπόρεσα να μιλήσω με το Vercel.`);
            console.error("Σφάλμα JS:", error);
        }
    }

    // 3. Εμφάνιση Μηνυμάτων στο Chat Log
    function appendMessage(sender, text) {
        if (!chatLog) return;
        const bubble = document.createElement('div');
        
        // Χρησιμοποιούμε τις κλάσεις από το style.css σου
        bubble.classList.add('message');
        if (sender === 'user') {
            bubble.classList.add('user-message');
            bubble.innerHTML = `<strong>Εσύ:</strong> ${text}`;
        } else {
            bubble.classList.add('ai-message');
            bubble.innerHTML = `<strong>Στάθης:</strong> ${text}`;
        }

        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight; // Αυτόματο σκρολάρισμα προς τα κάτω
    }

    // Event Listeners για το κουμπί και το Enter
    if(sendBtn) sendBtn.addEventListener('click', handleSend);
    if(userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});

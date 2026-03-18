const API_KEY = "YOUR_GEMINI_API_KEY"; // Θα το κρύψουμε στο Vercel μετά!

document.addEventListener('DOMContentLoaded', () => {
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');
    const liveVideo = document.getElementById('live-video');
    
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatLog = document.getElementById('chat-log');

    // 1. ΕΝΑΛΛΑΓΗ ΟΘΟΝΩΝ
    acceptBtn.addEventListener('click', () => {
        callScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        if (liveVideo) liveVideo.play();
    });

    declineBtn.addEventListener('click', () => {
        document.body.innerHTML = `<div style="text-align:center; margin-top:20vh; color:white;"><h1>Η κλήση τερματίστηκε.</h1><button onclick="location.reload()">Επαναφορά</button></div>`;
    });

    // 2. ΛΕΙΤΟΥΡΓΙΑ CHAT
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // Εμφάνιση μηνύματος χρήστη
        appendMessage('user', text);
        userInput.value = '';

        // Κλήση στο Gemini
        try {
            const aiResponse = await askGemini(text);
            appendMessage('ai', aiResponse);
        } catch (error) {
            appendMessage('ai', "Σόρι, έχω ένα μικρό πρόβλημα στη σύνδεση. Ξαναδοκίμασε!");
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
        bubble.innerText = text;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll στο τέλος
    }

    // 3. ΣΥΝΔΕΣΗ ΜΕ GEMINI API
    async function askGemini(question) {
        // Εδώ ορίζεις ποιος είσαι!
        const systemInstruction = "Είσαι ο Στάθης. Είσαι προγραμματιστής, 25 χρονών, ειδικός σε React και Node.js. Δουλεύεις στην εταιρεία X. Απάντα πάντα σε πρώτο πρόσωπο, φιλικά και επαγγελματικά.";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemInstruction}\n\nΕρώτηση χρήστη: ${question}` }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
});

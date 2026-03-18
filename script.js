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
        if (liveVideo) {
            liveVideo.play().catch(e => console.log("Video play failed", e));
        }
    });

    declineBtn.addEventListener('click', () => {
        window.location.href = "https://www.linkedin.com/in/stathis-drimilis-743015112/"; // Το LinkedIn σου
    });

    // 2. ΛΕΙΤΟΥΡΓΙΑ CHAT
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        try {
            // ΚΑΛΟΥΜΕ ΤΟ API (το Vercel θα βρει αυτόματα το api/index.js)
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: text })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                appendMessage('ai', "Σφάλμα διακομιστή. Δοκίμασε πάλι αργότερα.");
                return;
            }

            const data = await response.json();
            
            if (data.reply) {
                typeWriter(data.reply);
            } else {
                appendMessage('ai', "Δεν έλαβα έγκυρη απάντηση.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            appendMessage('ai', "Αποτυχία σύνδεσης. Βεβαιώσου ότι είσαι στο link του Vercel.");
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

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
        const speed = 25; // Ταχύτητα γραφής

        function type() {
            if (i < text.length) {
                bubble.innerText += text.charAt(i);
                i++;
                chatLog.scrollTop = chatLog.scrollHeight;
                setTimeout(type, speed);
            }
        }
        type();
    }
});

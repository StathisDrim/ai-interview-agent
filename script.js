// Το νέο URL του Vercel που έφτιαξες
const VERCEL_URL = 'https://ai-interview-agent-sooty.vercel.app/api/chat';

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatLog = document.getElementById('chat-log');
    
    // Στοιχεία του δικού σου UI (Από το HTML/CSS σου)
    const acceptBtn = document.getElementById('accept-btn');
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');

    // Αν υπάρχει το κουμπί "Αποδοχή", κάνε την αλλαγή οθόνης
    if (acceptBtn && callScreen && chatScreen) {
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
                let reply = "Δεν μπόρεσα να διαβάσω την απάντηση.";
                if (Array.isArray(result) && result[0].generated_text) {
                    reply = result[0].generated_text;
                } else if (result.generated_text) {
                    reply = result.generated_text;
                }
                
                // Καθαρίζουμε τα περιττά σύμβολα του AI για να φαίνεται ωραία στο UI σου
                if (reply.includes('[/INST]')) {
                    reply = reply.split('[/INST]')[1].trim();
                }
                
                appendMessage('ai', reply);
            } else {
                appendMessage('ai', `🔴 ΣΦΑΛΜΑ API (${response.status}): ${JSON.stringify(result)}`);
            }
        } catch (error) {
            appendMessage('ai', `🔴 ΑΠΟΤΥΧΙΑ ΣΥΝΔΕΣΗΣ: Δεν μπορώ να μιλήσω με το Vercel.`);
            console.error("Σφάλμα JS:", error);
        }
    }

    function appendMessage(sender, text) {
        if (!chatLog) return;
        const bubble = document.createElement('div');
        
        // Inline CSS σε περίπτωση που λείπουν τα classes από το style.css
        bubble.style.padding = "10px";
        bubble.style.margin = "10px";
        bubble.style.borderRadius = "10px";
        bubble.style.maxWidth = "80%";
        bubble.style.fontFamily = "Arial, sans-serif";
        
        if (sender === 'user') {
            bubble.style.backgroundColor = '#007bff';
            bubble.style.color = 'white';
            bubble.style.marginLeft = 'auto';
            bubble.innerText = "Εσύ: " + text;
        } else {
            bubble.style.backgroundColor = '#eee';
            bubble.style.color = '#333';
            bubble.style.marginRight = 'auto';
            bubble.innerText = "Στάθης: " + text;
        }

        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    if(sendBtn) sendBtn.addEventListener('click', handleSend);
    if(userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});

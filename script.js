document.addEventListener('DOMContentLoaded', () => {
    // 1. ΣΤΟΙΧΕΙΑ UI
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    // ΤΟ ΝΕΟ ΣΟΥ URL ΑΠΟ ΤΟ VERCEL
    const VERCEL_API_URL = 'https://ai-interview-agent-37ob.vercel.app/api/chat';

    // 2. ΕΝΑΛΛΑΓΗ ΟΘΟΝΩΝ (ΑΠΟ ΚΛΗΣΗ ΣΕ CHAT)
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            callScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
            setTimeout(() => {
                appendMessage('ai', "Γεια! Είμαι ο ψηφιακός Στάθης. Πώς μπορώ να σε βοηθήσω σήμερα;");
            }, 500);
        });
    }

    // 3. ΛΕΙΤΟΥΡΓΙΑ ΑΠΟΣΤΟΛΗΣ ΜΗΝΥΜΑΤΟΣ
async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        try {
            const response = await fetch(VERCEL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: text }) // Στέλνουμε μόνο το κείμενο απλά
            });

            const result = await response.json();

            if (response.ok) {
                // ΔΟΚΙΜΑΖΟΥΜΕ ΟΛΟΥΣ ΤΟΥΣ ΠΙΘΑΝΟΥΣ ΤΡΟΠΟΥΣ ΠΟΥ ΑΠΑΝΤΑΕΙ ΤΟ AI
                let aiReply = "";
                if (Array.isArray(result) && result[0].generated_text) {
                    aiReply = result[0].generated_text;
                } else if (result.generated_text) {
                    aiReply = result.generated_text;
                } else {
                    aiReply = "Το AI απάντησε, αλλά δεν καταλαβαίνω τη μορφή: " + JSON.stringify(result).substring(0, 50);
                }
                
                // Καθαρίζουμε την απάντηση από τυχόν prompt tags αν εμφανιστούν
                aiReply = aiReply.replace(/<\|.*?\|>/g, "").trim();
                appendMessage('ai', aiReply);

            } else {
                if (result.error && result.error.includes("loading")) {
                    appendMessage('ai', "Το AI φορτώνει τις γνώσεις του... Ξαναστείλε σε 10 δευτερόλεπτα!");
                } else {
                    appendMessage('ai', "Σφάλμα: " + (result.error || "Πρόβλημα στον server"));
                }
            }

        } catch (error) {
            appendMessage('ai', "Αποτυχία σύνδεσης με τον ψηφιακό Στάθη.");
        }
    }

    // 4. ΣΥΝΑΡΤΗΣΗ ΕΜΦΑΝΙΣΗΣ ΜΗΝΥΜΑΤΩΝ (Bubbles)
    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
        
        // Βασικό styling για να φαίνονται σωστά
        bubble.style.padding = "12px";
        bubble.style.margin = "10px";
        bubble.style.borderRadius = "15px";
        bubble.style.maxWidth = "80%";
        bubble.style.wordWrap = "break-word";
        bubble.style.display = "block";
        bubble.style.fontSize = "16px";
        bubble.style.fontFamily = "sans-serif";
        
        if (sender === 'user') {
            bubble.style.backgroundColor = "#007bff";
            bubble.style.color = "white";
            bubble.style.marginLeft = "auto";
            bubble.innerText = "Εσύ: " + text;
        } else {
            bubble.style.backgroundColor = "#f1f0f0";
            bubble.style.color = "#333";
            bubble.style.marginRight = "auto";
            bubble.innerText = "Στάθης: " + text;
        }

        chatLog.appendChild(bubble);
        
        // Αυτόματο scroll προς τα κάτω
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // 5. EVENT LISTENERS
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }
});

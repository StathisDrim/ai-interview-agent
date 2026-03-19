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

        // Εμφάνιση μηνύματος χρήστη στο UI
        appendMessage('user', text);
        userInput.value = '';

        try {
            // ΚΛΗΣΗ ΣΤΟ API ΣΟΥ ΣΤΟ VERCEL
            const response = await fetch(VERCEL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nΕίσαι ο Στάθης (Warehouse Specialist). Απάντα σύντομα, φιλικά και επαγγελματικά στα ελληνικά.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`
                })
            });

            const result = await response.json();

            // Έλεγχος αν η απάντηση είναι σωστή
            if (response.ok) {
                // Το Hugging Face επιστρέφει συνήθως έναν πίνακα [ { generated_text: "..." } ]
                if (result && result[0] && result[0].generated_text) {
                    appendMessage('ai', result[0].generated_text.trim());
                } else {
                    appendMessage('ai', "Έλαβα απάντηση αλλά χωρίς κείμενο. Δοκίμασε ξανά.");
                }
            } else {
                // Διαχείριση σφαλμάτων από τον Server (Vercel/HuggingFace)
                if (result.error && (result.estimated_time || result.error.includes("currently loading"))) {
                    appendMessage('ai', "Το AI ετοιμάζεται (κάνει boot). Ξαναδοκίμασε σε 10 δευτερόλεπτα...");
                } else {
                    appendMessage('ai', `Σφάλμα API (${response.status}): ${result.error || "Άγνωστο πρόβλημα"}`);
                }
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            appendMessage('ai', "Αποτυχία σύνδεσης. Βεβαιώσου ότι έχεις ίντερνετ και το Vercel είναι live.");
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

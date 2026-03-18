document.addEventListener('DOMContentLoaded', () => {
    // ΣΤΟΙΧΕΙΑ UI
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    // 1. ΕΝΑΛΛΑΓΗ ΟΘΟΝΩΝ (ΑΠΟ ΚΛΗΣΗ ΣΕ CHAT)
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            callScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
            // Μικρό καλωσόρισμα από τον Στάθη
            setTimeout(() => {
                appendMessage('ai', "Γεια! Είμαι ο Στάθης. Πώς μπορώ να σε βοηθήσω σήμερα;");
            }, 500);
        });
    }

    // 2. ΛΕΙΤΟΥΡΓΙΑ ΑΠΟΣΤΟΛΗΣ ΜΗΝΥΜΑΤΟΣ
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // Εμφάνιση μηνύματος χρήστη
        appendMessage('user', text);
        userInput.value = '';

        try {
            // ΚΑΛΟΥΜΕ ΤΟ ΔΙΚΟ ΜΑΣ API ΣΤΟ VERCEL (ΟΧΙ ΤΟ HUGGING FACE ΑΠΕΥΘΕΙΑΣ)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nΕίσαι ο Στάθης (Warehouse Specialist). Απάντα σύντομα, φιλικά και επαγγελματικά στα ελληνικά.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                    parameters: { max_new_tokens: 150, return_full_text: false }
                })
            });

            const result = await response.json();

            // Έλεγχος αν το μοντέλο φορτώνει (πρώτη φορά)
            if (result.error && result.estimated_time) {
                appendMessage('ai', "Μισό λεπτό να ετοιμαστώ (το σύστημα φορτώνει)...");
                return;
            }

            if (result && result[0] && result[0].generated_text) {
                appendMessage('ai', result[0].generated_text.trim());
            } else if (result.error) {
                appendMessage('ai', "Σφάλμα API: " + result.error);
            } else {
                appendMessage('ai', "Δεν πήρα απάντηση, δοκίμασε πάλι.");
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            appendMessage('ai', "Σφάλμα σύνδεσης. Βεβαιώσου ότι το Vercel API είναι live.");
        }
    }

    // 3. ΣΥΝΑΡΤΗΣΗ ΕΜΦΑΝΙΣΗΣ ΜΗΝΥΜΑΤΩΝ
    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
        
        // Βασικό styling αν δεν έχεις CSS
        bubble.style.padding = "10px";
        bubble.style.margin = "8px";
        bubble.style.borderRadius = "12px";
        bubble.style.maxWidth = "80%";
        bubble.style.wordWrap = "break-word";
        bubble.style.display = "block";
        
        if (sender === 'user') {
            bubble.style.backgroundColor = "#007bff";
            bubble.style.color = "white";
            bubble.style.marginLeft = "auto";
            bubble.innerText = "Εσύ: " + text;
        } else {
            bubble.style.backgroundColor = "#e9e9eb";
            bubble.style.color = "black";
            bubble.style.marginRight = "auto";
            bubble.innerText = "Στάθης: " + text;
        }

        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // 4. EVENT LISTENERS ΓΙΑ ΚΟΥΜΠΙΑ ΚΑΙ ENTER
    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});

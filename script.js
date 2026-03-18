async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    try {
        const response = await fetch('https://ai-interview-agent-gsad.vercel.app/api/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: text // Απλό κείμενο για δοκιμή
            })
        });

        // ΑΝ Ο SERVER ΕΠΙΣΤΡΕΨΕΙ ΣΦΑΛΜΑ (404, 500, 410 κτλ)
        if (!response.ok) {
            const errorText = await response.text(); // Παίρνουμε το κείμενο του σφάλματος
            appendMessage('ai', `ΣΦΑΛΜΑ ${response.status}: ${errorText.substring(0, 100)}`);
            return;
        }

        const result = await response.json();
        
        if (result && result[0]) {
            appendMessage('ai', result[0].generated_text || "Δεν πήρα κείμενο");
        } else {
            appendMessage('ai', "Το API απάντησε, αλλά η δομή είναι περίεργη: " + JSON.stringify(result).substring(0, 50));
        }

    } catch (e) {
        // ΑΝ ΔΕΝ ΜΠΟΡΕΙ ΚΑΝ ΝΑ ΣΥΝΔΕΘΕΙ (CORS ή Internet)
        appendMessage('ai', "ΑΠΟΤΥΧΙΑ ΣΥΝΔΕΣΗΣ: " + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const callScreen = document.getElementById('call-screen');
    const chatScreen = document.getElementById('chat-screen');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');
    const liveVideo = document.getElementById('live-video');

    // Λογική για το "Σήκωμα" της κλήσης
    acceptBtn.addEventListener('click', () => {
        // Κρύβουμε την οθόνη κλήσης και δείχνουμε το chat
        callScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');

        // Ξεκινάμε το βίντεο (loop)
        if (liveVideo) {
            liveVideo.play().catch(error => {
                console.log("Το βίντεο δεν ξεκίνησε αυτόματα (auto-play policy):", error);
            });
        }
    });

    // Λογική για το "Κλείσιμο" (Decline)
    declineBtn.addEventListener('click', () => {
        // Στους browsers δεν μπορούμε να κλείσουμε το tab.
        // Θα δείξουμε ένα μήνυμα ή θα κάνουμε redirect.
        document.body.innerHTML = `
            <div style="text-align:center; padding:100px; color:#aaa; font-family:sans-serif;">
                <h1>Η κλήση τερματίστηκε.</h1>
                <p>Ευχαριστούμε που επισκεφθήκατε το AI Portfolio του Στάθη.</p>
                <a href="#" onclick="window.location.reload()" style="color:#4cd964; text-decoration:none;">Δοκιμάστε ξανά</a>
            </div>
        `;
    });
});

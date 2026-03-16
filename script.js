function acceptCall() {
  document.getElementById("call-screen").style.display = "none";
  document.querySelector(".meeting-container").style.display = "flex";
}

function sendMessage(){
  let question = document.getElementById("question").value;
  if(!question) return;

  let chatbox = document.getElementById("chatbox");

  // HR question
  chatbox.innerHTML += `<p><b>HR:</b> ${question}</p>`;

  // Mock AI answer
  let response = "Thanks for your question! I will answer here soon.";
  chatbox.innerHTML += `<p><b>Stathis:</b> ${response}</p>`;

  document.getElementById("question").value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
}

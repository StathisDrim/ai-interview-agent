
function acceptCall(){
  document.getElementById("call-screen").style.display="none";
  document.getElementById("chat-screen").style.display="flex";
}

function sendMessage(){
  let question = document.getElementById("question").value;
  if(!question) return;

  let chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<p><b>HR:</b> ${question}</p>`;

  // Mock AI response
  let response = "Thanks for your question! I will answer here soon.";
  chatbox.innerHTML += `<p><b>AI:</b> ${response}</p>`;

  document.getElementById("question").value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
}

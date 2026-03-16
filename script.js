function acceptCall(){

document.getElementById("call-screen").style.display="none";
document.getElementById("meeting-screen").style.display="flex";

}

function sendMessage(){

let question=document.getElementById("question").value;
if(!question) return;

let chatbox=document.getElementById("chatbox");

chatbox.innerHTML+=`<p><b>HR:</b> ${question}</p>`;

let response="Thanks for your answer. Tell me more about your experience.";

chatbox.innerHTML+=`<p><b>AI HR:</b> ${response}</p>`;

document.getElementById("question").value="";
chatbox.scrollTop=chatbox.scrollHeight;

}

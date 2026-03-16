function acceptCall(){

document.getElementById("call-screen").style.display="none";

document.getElementById("meeting-screen").style.display="flex";

startInterview();

}



function startInterview(){

let chatbox=document.getElementById("chatbox");

chatbox.innerHTML+=`
<p><b>AI HR:</b> Hello Stathis, welcome to your AI interview.</p>
<p><b>AI HR:</b> Tell me a little about yourself.</p>
`;

}



function sendMessage(){

let question=document.getElementById("question").value;

if(!question) return;

let chatbox=document.getElementById("chatbox");

chatbox.innerHTML+=`<p><b>Stathis:</b> ${question}</p>`;

let response="Thank you for your answer. Let's continue the interview.";

chatbox.innerHTML+=`<p><b>AI HR:</b> ${response}</p>`;

document.getElementById("question").value="";

chatbox.scrollTop=chatbox.scrollHeight;

}

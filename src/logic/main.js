const API_KEY = "AIzaSyDigGJVHQdJcawWiKAkpxlEq7Lx9nkz_vc"; // Replace with your API key
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });

async function sendMessage() {
  const userText = input.value.trim();
  if(!userText) return;
  appendMessage('user', userText);
  input.value = '';

  const aiResponse = await getAIResponse(userText);
  appendMessage('ai', aiResponse);
}

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.textContent = (sender === 'user' ? 'You: ' : 'AI: ') + text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function getAIResponse(prompt) {
  try {
    const res = await fetch("https://generativeai.googleapis.com/v1beta2/models/text-bison-001:generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 200
      })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content || "AI did not respond.";
  } catch (err) {
    console.error(err);
    return "Error contacting AI.";
  }
}

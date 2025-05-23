const messages = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatTitle = document.getElementById('chat-title');
const newChatBtn = document.getElementById('new-chat');
let currentChat = [];

function appendMessage(text, sender = 'user') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

async function fetchResponse(prompt) {
  appendMessage('HydroGPT is thinking...', 'ai');
  try {
    const response = await fetch(`https://api.aiproxy.io/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are HydroGPT (Model H1), an intelligent, friendly AI assistant.' },
          ...currentChat,
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, no reply.';
    messages.lastChild.remove(); // remove thinking...
    appendMessage(reply, 'ai');
    currentChat.push({ role: 'assistant', content: reply });
  } catch {
    messages.lastChild.remove();
    appendMessage('Error connecting to AI service.', 'ai');
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;
  appendMessage(input, 'user');
  currentChat.push({ role: 'user', content: input });
  userInput.value = '';
  fetchResponse(input);
});

newChatBtn.addEventListener('click', () => {
  messages.innerHTML = '';
  currentChat = [];
  chatTitle.textContent = 'New Chat';
});

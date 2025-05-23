const messages = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatTitle = document.getElementById('chat-title');
const newChatBtn = document.getElementById('new-chat');
const chatList = document.getElementById('chat-list');

let currentChat = [];
let chatSessions = [];
let sessionId = 0;

function appendMessage(text, sender = 'user') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function createChatLabel(name) {
  const label = document.createElement('div');
  label.className = 'chat-label';
  label.textContent = name;
  label.addEventListener('click', () => loadChat(name));
  chatList.appendChild(label);
}

function loadChat(name) {
  const chat = chatSessions.find(s => s.name === name);
  if (!chat) return;
  currentChat = chat.data;
  chatTitle.textContent = chat.name;
  messages.innerHTML = '';
  for (const entry of chat.data) {
    appendMessage(entry.content, entry.role === 'user' ? 'user' : 'ai');
  }
}

function saveCurrentChat() {
  const name = `Chat ${++sessionId}`;
  chatSessions.push({ name, data: [...currentChat] });
  createChatLabel(name);
  chatTitle.textContent = name;
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
          { role: 'system', content: 'You are HydroGPT (Model H1), an intelligent and friendly assistant.' },
          ...currentChat,
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await response.json();
    messages.lastChild.remove();
    const reply = data.choices?.[0]?.message?.content || 'No response.';
    appendMessage(reply, 'ai');
    currentChat.push({ role: 'assistant', content: reply });
  } catch {
    messages.lastChild.remove();
    appendMessage('Error: AI service not reachable.', 'ai');
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
  if (currentChat.length) saveCurrentChat();
  currentChat = [];
  messages.innerHTML = '';
  chatTitle.textContent = 'New Chat';
});

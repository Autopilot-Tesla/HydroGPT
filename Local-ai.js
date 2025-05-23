// DEPRECATED: Local AI fallback — no longer used since real AI is integrated

function basicAI(prompt) {
  return "This mode is now disabled. Real AI has been enabled via API proxy.";
}

// Optional: fallback if API proxy fails — uncomment if needed
// async function fetchResponse(prompt) {
//   messages.lastChild?.remove();
//   await new Promise((r) => setTimeout(r, 500));
//   const reply = basicAI(prompt);
//   appendMessage(reply, 'ai');
//   currentChat.push({ role: 'assistant', content: reply });
// }

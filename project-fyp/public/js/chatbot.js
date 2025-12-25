/* ========================================
   AI TRAVEL CHATBOT FUNCTIONALITY
   ======================================== */

// Configuration
const CHATBOT_API_URL = 'http://localhost:8000/api/chat/'; // Update this with your Django server URL

// DOM Elements
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotSendBtn = chatbotForm.querySelector('.chatbot-send-btn');

// State
let isOpen = false;

// Toggle chatbot window
function toggleChatbot() {
  isOpen = !isOpen;
  if (isOpen) {
    chatbotWindow.classList.add('active');
    chatbotInput.focus();
  } else {
    chatbotWindow.classList.remove('active');
  }
}

// Add message to chat
function addMessage(text, isUser = false, isError = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'} ${isError ? 'error-message' : ''}`;
  
  const iconClass = isUser ? 'fa-user' : 'fa-robot';
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <i class="fas ${iconClass} message-icon"></i>
      <div class="message-text">${escapeHtml(text)}</div>
    </div>
  `;
  
  chatbotMessages.appendChild(messageDiv);
  scrollToBottom();
}

// Add typing indicator
function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chatbot-message bot-message';
  typingDiv.id = 'typing-indicator';
  
  typingDiv.innerHTML = `
    <div class="message-content">
      <i class="fas fa-robot message-icon"></i>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatbotMessages.appendChild(typingDiv);
  scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Scroll to bottom of messages
function scrollToBottom() {
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Send message to chatbot API
async function sendMessage(message) {
  try {
    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.reply) {
      return data.reply;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error('No reply from chatbot');
    }
  } catch (error) {
    console.error('Chatbot API Error:', error);
    throw error;
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  const message = chatbotInput.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, true);
  
  // Clear input
  chatbotInput.value = '';
  
  // Disable send button
  chatbotSendBtn.disabled = true;
  
  // Show typing indicator
  addTypingIndicator();
  
  try {
    // Send message to API
    const reply = await sendMessage(message);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add bot reply
    addMessage(reply);
  } catch (error) {
    // Remove typing indicator
    removeTypingIndicator();
    
    // Show error message
    addMessage('Sorry, I encountered an error. Please try again later or check if the chatbot server is running.', false, true);
  } finally {
    // Re-enable send button
    chatbotSendBtn.disabled = false;
    chatbotInput.focus();
  }
}

// Event Listeners
chatbotToggle.addEventListener('click', toggleChatbot);
chatbotClose.addEventListener('click', toggleChatbot);
chatbotForm.addEventListener('submit', handleSubmit);

// Close chatbot when clicking outside
document.addEventListener('click', (e) => {
  if (isOpen && 
      !chatbotWindow.contains(e.target) && 
      !chatbotToggle.contains(e.target)) {
    toggleChatbot();
  }
});

// Keyboard shortcut (Ctrl/Cmd + K)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggleChatbot();
  }
});

console.log('✅ AI Travel Chatbot initialized');

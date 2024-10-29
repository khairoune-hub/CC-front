const md = window.markdownit();
let threadId = null;

window.addEventListener('load', () => {
    const spinner = document.getElementById('spinner');
    const minimumLoadingTime = 1000;
    
    setTimeout(() => {
        spinner.style.display = 'none';
    }, minimumLoadingTime);
});

document.addEventListener('DOMContentLoaded', () => {
    initializeThread();
    setupEventListeners();
});

// Set up event listeners for the UI
function setupEventListeners() {
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);
    document.getElementById('info').addEventListener('click', showInfo);
}

// Handle Enter key for sending messages
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Display information about the assistant
function showInfo() {
    alert('BCOS Content Creation Assistant - Ready to help you generate and organize content! By: Moussa KHAIROUNE');
}

// Initialize a new thread by calling the Worker endpoint
async function initializeThread() {
    try {
        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/new-thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (response.ok) {
            threadId = data.threadId;
            console.log('Thread initialized:', threadId);
        } else {
            throw new Error(data.error || 'Failed to initialize thread');
        }
    } catch (error) {
        console.error('Error initializing thread:', error);
        addMessage('Failed to initialize chat. Please refresh the page.', false);
    }
}

// Add a message to the chat UI
function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    // Handle Arabic text alignment and Markdown rendering
    if (!isUser) {
        const isArabic = /[\u0600-\u06FF]/.test(message);
        messageElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
        message = md.render(message);
    }
    
    messageElement.innerHTML = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;  // Scroll to the latest message
}

// Send the user's message to the assistant and display the response
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message || !threadId) return;
    
    addMessage(message, true);  // Display user's message
    userInput.value = '';       // Clear input field
    showTypingIndicator();      // Show typing indicator AFTER user message is displayed

    try {
        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, threadId })
        });

        const data = await response.json();
        
        if (response.ok) {
            addMessage(data.message, false);  // Display assistant's response
        } else {
            throw new Error(data.error || 'Failed to get response');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
        hideTypingIndicator();
    }
}

// Show and hide typing indicator for the assistant
function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'block';
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

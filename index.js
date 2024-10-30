// Initialize markdown-it
// const md = window.markdownit();

// Global thread ID
let threadId = null;
window.addEventListener('load', () => {
    const spinner = document.getElementById('spinner');
    const minimumLoadingTime = 1000;
    
    setTimeout(() => {
        spinner.style.display = 'none';
    }, minimumLoadingTime);
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeThread();
    setupEventListeners();
    // adjustTextareaHeight(); // Initial height adjustment
});

// Set up all event listeners
function setupEventListeners() {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const infoButton = document.getElementById('info');

    sendButton?.addEventListener('click', handleSendMessage);
    userInput?.addEventListener('keypress', handleKeyPress);
    // userInput?.addEventListener('input', adjustTextareaHeight);
    infoButton?.addEventListener('click', showInfo);

    // Prevent form submission on Enter if textarea is empty
    userInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !userInput.value.trim()) {
            e.preventDefault();
        }
    });
}

// Adjust textarea height based on content
// function adjustTextareaHeight() {
//     const textarea = document.getElementById('user-input');
//     if (!textarea) return;

//     textarea.style.height = 'auto';
//     textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
// }

// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

// Handle send message button click
function handleSendMessage() {
    const userInput = document.getElementById('user-input');
    if (!userInput) return;

    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
    }
}

// Show information about the assistant
function showInfo() {
    alert('BCOS Content Creation Assistant - Ready to help you generate and organize content! By: Moussa KHAIROUNE');
}

// Initialize a new thread
async function initializeThread() {
    try {
        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/new-thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Failed to initialize thread');
        }

        const data = await response.json();
        threadId = data.threadId;
        console.log('Thread initialized:', threadId);
        
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
        // message = md.render(message);
    } else {
        messageElement.textContent = message;
    }
    
    // Insert message before the typing indicator
    const typingIndicator = document.getElementById('typing-indicator');
    chatMessages.insertBefore(messageElement, typingIndicator);
    
    // Scroll to the new message
    messageElement.scrollIntoView({ behavior: 'smooth' });
}

// Send message to the assistant
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message || !threadId) return;
    
    // Display user's message
    addMessage(message, true);
    
    // Clear input and reset height
    userInput.value = '';
    // adjustTextareaHeight();
    
    // Show typing indicator immediately after user's message
    showTypingIndicator();
    
    try {
        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, threadId })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Hide typing indicator before showing response
            hideTypingIndicator();
            // Display assistant's response
            console.log(data);
            addMessage(data.message, false);
        } else {
            throw new Error(data.error || 'Failed to get response');
        }
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again.', false);
    }
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator) return;

    typingIndicator.style.display = 'block';
    typingIndicator.scrollIntoView({ behavior: 'smooth' });
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator) return;

    typingIndicator.style.display = 'none';
}

// Disable send button when no input
function updateSendButtonState() {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    
    if (sendButton && userInput) {
        sendButton.disabled = !userInput.value.trim();
    }
}

// Error handler for fetch requests
function handleFetchError(error) {
    console.error('Network error:', error);
    hideTypingIndicator();
    addMessage('Network error occurred. Please check your connection and try again.', false);
}

// Clean up function for when component unmounts or page closes
function cleanup() {
    // Remove event listeners if needed
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const infoButton = document.getElementById('info');

    userInput?.removeEventListener('keypress', handleKeyPress);
    userInput?.removeEventListener('input', adjustTextareaHeight);
    sendButton?.removeEventListener('click', handleSendMessage);
    infoButton?.removeEventListener('click', showInfo);
}

// Handle window unload
// window.addEventListener('unload', cleanup);

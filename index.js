// Initialize markdown-it
const md = window.markdownit();

// Global variables
let threadId = null;

let selectedPlatform = null;
let userContext = ''; // Declare userContext as a variable

function selectPlatform(platform) {
    // Remove selected class from all buttons
    document.querySelectorAll('.platform-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected class to clicked button
    const selectedBtn = document.querySelector(`.platform-option[onclick*="${platform}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }

    // Update the selectedPlatform variable
    selectedPlatform = platform;
    console.log('Selected platform:', selectedPlatform);

    // Update user context
    updateUserContext();
}

function updateUserContext() {
    switch(selectedPlatform) {
        case 'instagram':
            userContext = 'Create content optimized for Instagram with emphasis on visual appeal and engagement. Consider using relevant hashtags and keeping captions concise yet engaging mix between the arabic and the algerian accent.';
            break;
        case 'telegram':
            userContext = 'Create content suitable for Telegram channels and groups, focusing on clear formatting and effective use of message features mix between the arabic and the algerian accent.';
            break;
        case 'facebook':
            userContext = 'Create content optimized for Facebook with focus on engagement and shareability. Consider using mixed media and interactive elements mix between the arabic and the algerian accent.';
            break;
        case 'linkedin':
            userContext = 'Create professional content suitable for LinkedIn, focusing on business value and industry insights. Use formal tone and professional formatting in french.';
            break;
        case 'email':
            userContext = 'Create email-optimized content with clear subject lines, proper formatting, and compelling call-to-actions. Focus on professional communication in french.';
            break;
        default:
            userContext = '';
    }
    console.log(userContext)
    }


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
});

// Set up all event listeners
function setupEventListeners() {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const infoButton = document.getElementById('info');

    sendButton?.addEventListener('click', handleSendMessage);
    userInput?.addEventListener('keypress', handleKeyPress);
    // infoButton?.addEventListener('click', showInfo);

    // Prevent form submission on Enter if textarea is empty
    userInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !userInput.value.trim()) {
            e.preventDefault();
        }
    });
}
// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

// Handle send message button click
function handleSendMessage() {
    
    if (!selectedPlatform) {
        alert('Please select a platform before sending a message.');
        return; // Stop further execution
    }
    const userInput = document.getElementById('user-input');
    if (!userInput) return;

    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
    }
}

// Show information about the assistant
// function showInfo() {
//     alert('BCOS Content Creation Assistant - Ready to help you generate and organize content! By: Moussa KHAIROUNE');
// }

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
    // console.log('Adding message:', message); 
    // console.log('Is user message:', isUser); 
    
    const chatMessages = document.getElementById('chat-messages');
    console.log('Chat messages container:', chatMessages); 
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    // Handle Arabic text alignment and Markdown/HTML rendering
    const isArabic = /[\u0600-\u06FF]/.test(message);
    messageElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

    if (!isUser) {
        // For bot messages, render markdown and set as HTML
        const renderedMessage = md.render(message);
        messageElement.innerHTML = renderedMessage;
    } else {
        // For user messages, just set as HTML
        messageElement.innerHTML = message;
    }
    
    console.log('Message element created:', messageElement);
    
    const typingIndicator = document.getElementById('typing-indicator');
    console.log('Typing indicator:', typingIndicator);
    
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
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        console.log(userContext)
        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                threadId,
                context: userContext // Add context to the request
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            hideTypingIndicator();
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
window.addEventListener('unload', cleanup);

// script.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// Initialize OpenAI client (you'll need to securely provide your API key)
const openai = new OpenAI({
    apiKey: 'your-api-key', // WARNING: Don't hardcode this - use environment variables
    dangerouslyAllowBrowser: true // Required for client-side usage
});

const ASSISTANT_ID = 'your-assistant-id'; // Your Assistant ID

window.addEventListener('load', () => {
    const spinner = document.getElementById('spinner');
    const minimumLoadingTime = 1000;
    
    setTimeout(() => {
        spinner.style.display = 'none';
    }, minimumLoadingTime);
});

const button = document.getElementById('info');
button.addEventListener('click', function() {
    alert('This is your BCOS content creation assistant, ready to help you generate and organize content!, by : Moussa KHAIROUNE ');
});

let threadId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeThread();
    
    document.getElementById('send-button').addEventListener('click', sendMessage);
    
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function convertToHtml(message) {
    const md = window.markdownit();
    return md.render(message);
}

function addMessage(Message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    if (!isUser) {
        const arabicPattern = /[\u0600-\u06FF]/;
        messageElement.setAttribute('dir', arabicPattern.test(Message) ? 'rtl' : 'ltr');
        messageElement.innerHTML = convertToHtml(Message);
    } else {
        messageElement.innerHTML = Message;
    }

    messageWrapper.appendChild(messageElement);

    const typingIndicator = document.getElementById('typing-indicator');
    chatMessages.insertBefore(messageWrapper, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'block';
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

async function initializeThread() {
    try {
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        console.log('Thread initialized:', threadId);
    } catch (error) {
        console.error('Error initializing thread:', error);
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    addMessage(message, true);
    userInput.value = '';
    
    await getBotResponse(message);
}

async function getBotResponse(userMessage) {
    showTypingIndicator();

    try {
        // Add the message to the thread
        await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: userMessage
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });

        // Poll for completion
        let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        let attempts = 0;
        const maxAttempts = 30;

        while (runStatus.status !== 'completed' && runStatus.status !== 'failed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            attempts++;
        }

        if (runStatus.status === 'failed') {
            throw new Error('Assistant run failed');
        }

        if (attempts >= maxAttempts) {
            throw new Error('Assistant response timeout');
        }

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(threadId);
        const assistantResponse = messages.data[0].content[0].text.value;
        
        addMessage(assistantResponse, false);
    } catch (error) {
        console.error('Error getting bot response:', error);
        addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
        hideTypingIndicator();
    }
}

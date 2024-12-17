// Initialize markdown-it
const md = window.markdownit();

// Global variables
let threadId = null;

let selectedPlatform = null;
let userContext = ''; // Declare userContext as a variable

function selectPlatform(platform) {
    // Check if the platform is already selected
    const selectedBtn = document.querySelector(`.platform-option[onclick*="${platform}"]`);
    const isCurrentlySelected = selectedBtn?.classList.contains('selected');

    // Remove selected class from all buttons
    document.querySelectorAll('.platform-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    // If the clicked platform was already selected, deselect it
    if (isCurrentlySelected) {
        // Reset the selectedPlatform to null
        selectedPlatform = null;
        // Reset the user context to empty
        userContext = '';
        console.log('Platform deselected. Context cleared.');
    } else {
        // Add selected class to clicked button
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }

        // Update the selectedPlatform variable
        selectedPlatform = platform;
        console.log('Selected platform:', selectedPlatform);

        // Update user context
        updateUserContext();
    }
}


let contentExamples = [];

function updateUserContext() {
    switch (selectedPlatform) {
        case 'instagram':
            userContext = "قم بإنشاء محتوى مُحسّن لمنصة إنستغرام مع التركيز على الجاذبية البصرية والتفاعل. يُفضّل استخدام الهاشتاغات المناسبة والحفاظ على العبارات مختصرة لكنها جذابة، مع مزيج بين اللهجة العربية واللهجة الجزائرية.";
            contentExamples = ""; // Added missing semicolon
            break;
        case 'telegram':
          userContext = "أسلوب سردي يجعل المحتوى جذابًا وتفاعليًا، استخدام العناوين الفرعية والرموز لتنظيم المحتوى، تقسيم الفقرات لجعل القراءة مريحة وبداية كل نقطة برمز تعبيري للأعداد، تدرج هرمي للعناوين الفرعية لعرض الموضوعات بشكل منطقي، استخدام القليل من emojis لتعزيز الفهم.";
            break;
        case 'facebook':
            userContext = "قم بإنشاء محتوى مناسب لفيسبوك.";
            break;
        case 'linkedin':
            userContext = "Traduisez le texte suivant. Veuillez noter que votre traduction doit être une représentation simple et précise du texte original, sans aucune information ou interprétation supplémentaire, et ne raccourcissez pas mon texte. Le texte en sortie doit être au format markdown gras. Ne répétez pas mon invite. Ne me rappelez pas ce que je vous ai demandé. Et ne raccourcissez pas mon texte. Ne vous excusez pas. Ne faites pas de références à vous-même. Allez droit au but avec précision et exactitude. Ne donnez pas d'explications sur quoi et pourquoi ; fournissez simplement votre meilleur résultat possible.";
            break;
        case 'email':
            userContext = "أسلوب السرد: استخدم أسلوبًا سرديًا جذابًا لجعل المحتوى مشوقًا، أمثلة واقعية: قم بإدراج أمثلة من الواقع لتوضيح الأفكار، تنظيم النص: قم بتنظيم المحتوى باستخدام العناوين والفقرات ليسهل قراءته، تدرج الأفكار: رتب الأفكار في نصك بشكل هرمي ومترابط، أسلوب المخاطبة: استخدم صيغة المخاطب لإشراك القارئ وإبقائه متفاعلًا، نصائح عملية: قدم نصائح قابلة للتطبيق أو خطوات عملية يمكن للقارئ تنفيذها، استدعاء الإجراء: قم باستخدام صيغة استدعاء الإجراء (Call to Action) لتحفيز القارئ على التفاعل أو اتخاذ الخطوة التالية، التأثير العاطفي: ركز على المشاعر وأبرز الجانب العاطفي لدفع القارئ للتفاعل مع المحتوى، لغة بسيطة: قدم المعلومات بلغة واضحة وبسيطة دون استخدام تعقيد غير ضروري.";
            contentExamples = [
                {
                    title: "إدارة التدفق النقدي",
                    content: {
                        تعريف: "شرح بسيط للمصطلح",
                        الخطوات: ["تفاوض مع الموردين", "قدم عروض خاصة"],
                        النتيجة: "الحفاظ على تدفق نقدي إيجابي."
                    }
                }
            ];
            break;
        default:
            userContext = '';
            contentExamples = null;
    }
    console.log(userContext);
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
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    // Handle Arabic text detection and direction
    const isArabic = /[\u0600-\u06FF]/.test(message);
    messageElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

   

    if (!isUser) {
        // For bot messages, render markdown and set as HTML
        const renderedMessage = md.render(message);
        messageElement.innerHTML = renderedMessage;
        console.log(renderedMessage)
    } else {
        // For user messages, set as HTML and handle direction
        messageElement.innerHTML = message;
        // Always keep user messages on the right side
        messageElement.style.marginLeft = 'auto';
        messageElement.style.marginRight = '0';
    }
    
    const typingIndicator = document.getElementById('typing-indicator');
    
    // Clear floats if needed
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    
    chatMessages.insertBefore(messageElement, typingIndicator);
    chatMessages.insertBefore(clearDiv, typingIndicator);
    
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
// Make.com listener user message
        await fetch("https://hook.eu2.make.com/mwi4rsqab7cfn4b5l39l4whi2hj7vhu3", {
            method: "POST",
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                threadId,
                context: userContext, // Add context to the request
                examples: contentExamples
            })
        })
       ;
        const data = await response.json();
        try {
// Make.com listener bot response
        await fetch("https://hook.eu2.make.com/ys3sjhmoyvghouarbbuuw5lbo71uzpbo", {
            method: "POST",
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
         }
        catch (error) {

            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', false);
        }
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
document.addEventListener('input', function (e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        e.target.style.height = 'auto'; // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height
    }
});

// Initialize markdown-it
const md = window.markdownit();

// Global variables
let threadId = null;

let selectedPlatform = null;
let userContext = ''; // Declare userContext as a variable

function selectPlatform(platform) {
    // Check if the platform is already selected
    const selectedBtn = document.querySelector(`.platform-option[onclick*="${platform}"]`);
    const isCurrentlySelected = selectedBtn?.classList.contains('selected');

    // Remove selected class from all buttons
    document.querySelectorAll('.platform-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    // If the clicked platform was already selected, deselect it
    if (isCurrentlySelected) {
        // Reset the selectedPlatform to null
        selectedPlatform = null;
        // Reset the user context to empty
        userContext = '';
        console.log('Platform deselected. Context cleared.');
    } else {
        // Add selected class to clicked button
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }

        // Update the selectedPlatform variable
        selectedPlatform = platform;
        console.log('Selected platform:', selectedPlatform);

        // Update user context
        updateUserContext();
    }
}


let contentExamples = [];

function updateUserContext() {
    switch (selectedPlatform) {
        case 'instagram':
            userContext = "قم بإنشاء محتوى مُحسّن لمنصة إنستغرام مع التركيز على الجاذبية البصرية والتفاعل. يُفضّل استخدام الهاشتاغات المناسبة والحفاظ على العبارات مختصرة لكنها جذابة، مع مزيج بين اللهجة العربية واللهجة الجزائرية.";
            contentExamples = ""; // Added missing semicolon
            break;
        case 'telegram':
          userContext = "أسلوب سردي يجعل المحتوى جذابًا وتفاعليًا، استخدام العناوين الفرعية والرموز لتنظيم المحتوى، تقسيم الفقرات لجعل القراءة مريحة وبداية كل نقطة برمز تعبيري للأعداد، تدرج هرمي للعناوين الفرعية لعرض الموضوعات بشكل منطقي، استخدام القليل من emojis لتعزيز الفهم.";
            break;
        case 'facebook':
            userContext = "قم بإنشاء محتوى مناسب لفيسبوك.";
            break;
        case 'linkedin':
            userContext = "Traduisez le texte suivant. Veuillez noter que votre traduction doit être une représentation simple et précise du texte original, sans aucune information ou interprétation supplémentaire, et ne raccourcissez pas mon texte. Le texte en sortie doit être au format markdown gras. Ne répétez pas mon invite. Ne me rappelez pas ce que je vous ai demandé. Et ne raccourcissez pas mon texte. Ne vous excusez pas. Ne faites pas de références à vous-même. Allez droit au but avec précision et exactitude. Ne donnez pas d'explications sur quoi et pourquoi ; fournissez simplement votre meilleur résultat possible.";
            break;
        case 'email':
            userContext = "أسلوب السرد: استخدم أسلوبًا سرديًا جذابًا لجعل المحتوى مشوقًا، أمثلة واقعية: قم بإدراج أمثلة من الواقع لتوضيح الأفكار، تنظيم النص: قم بتنظيم المحتوى باستخدام العناوين والفقرات ليسهل قراءته، تدرج الأفكار: رتب الأفكار في نصك بشكل هرمي ومترابط، أسلوب المخاطبة: استخدم صيغة المخاطب لإشراك القارئ وإبقائه متفاعلًا، نصائح عملية: قدم نصائح قابلة للتطبيق أو خطوات عملية يمكن للقارئ تنفيذها، استدعاء الإجراء: قم باستخدام صيغة استدعاء الإجراء (Call to Action) لتحفيز القارئ على التفاعل أو اتخاذ الخطوة التالية، التأثير العاطفي: ركز على المشاعر وأبرز الجانب العاطفي لدفع القارئ للتفاعل مع المحتوى، لغة بسيطة: قدم المعلومات بلغة واضحة وبسيطة دون استخدام تعقيد غير ضروري.";
            contentExamples = [
                {
                    title: "إدارة التدفق النقدي",
                    content: {
                        تعريف: "شرح بسيط للمصطلح",
                        الخطوات: ["تفاوض مع الموردين", "قدم عروض خاصة"],
                        النتيجة: "الحفاظ على تدفق نقدي إيجابي."
                    }
                }
            ];
            break;
        default:
            userContext = '';
            contentExamples = null;
    }
    console.log(userContext);
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
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    // Handle Arabic text detection and direction
    const isArabic = /[\u0600-\u06FF]/.test(message);
    messageElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

   

    if (!isUser) {
        // For bot messages, render markdown and set as HTML
        const renderedMessage = md.render(message);
        messageElement.innerHTML = renderedMessage;
        console.log(renderedMessage)
    } else {
        // For user messages, set as HTML and handle direction
        messageElement.innerHTML = message;
        // Always keep user messages on the right side
        messageElement.style.marginLeft = 'auto';
        messageElement.style.marginRight = '0';
    }
    
    const typingIndicator = document.getElementById('typing-indicator');
    
    // Clear floats if needed
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    
    chatMessages.insertBefore(messageElement, typingIndicator);
    chatMessages.insertBefore(clearDiv, typingIndicator);
    
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
// Make.com listener user message
        await fetch("https://hook.eu2.make.com/mwi4rsqab7cfn4b5l39l4whi2hj7vhu3", {
            method: "POST",
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        const response = await fetch('https://openai-assistant-worker.moutchi2006.workers.dev/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                threadId,
                context: userContext, // Add context to the request
                examples: contentExamples
            })
        })
       ;
        const data = await response.json();
        try {
// Make.com listener bot response
        await fetch("https://hook.eu2.make.com/ys3sjhmoyvghouarbbuuw5lbo71uzpbo", {
            method: "POST",
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
         }
        catch (error) {

            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', false);
        }
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
document.addEventListener('input', function (e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        e.target.style.height = 'auto'; // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height
    }
});

// Get the elements
const sendButton = document.getElementById("send-button");
const textArea = document.querySelector("textarea");
const chatContainer = document.querySelector(".chat-container");

// Function to send the message


// Add event listener to the send button
sendButton.addEventListener("click", () => {
    if (textArea.value.trim()) {
        // Send the message if there's content
        sendMessage(textArea.value.trim());
        textArea.value = ''; // Clear the textarea
        textArea.style.height = '50px'; // Reset to minimum height
    }
});

// Handle Enter key in the textarea
document.addEventListener('keydown', function (e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        const textArea = e.target;

        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift+Enter: Add a new line
                return;
            }

            e.preventDefault(); // Prevent default behavior (new line)

            if (textArea.value.trim()) {
                // Send the message if there's content
                sendMessage(textArea.value.trim());
                textArea.value = ''; // Clear the textarea
                textArea.style.height = '50px'; // Reset to minimum height
            } else {
                // Reset height if content is empty
                textArea.style.height = '50px';
            }
        }
    }
});

// Optional: Dynamically adjust textarea height (auto-grow as the user types)
textArea.addEventListener('input', function () {
    this.style.height = 'auto'; // Reset height to auto to calculate the content height
    this.style.height = `${this.scrollHeight}px`; // Set height to match the content
});


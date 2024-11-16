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
            userContext = "قم بإنشاء محتوى مُحسّن لمنصة إنستغرام مع التركيز على الجاذبية البصرية والتفاعل. يُفضّل استخدام الهاشتاغات المناسبة والحفاظ على العبارات مختصرة لكنها جذابة، مع مزيج بين اللهجة العربية واللهجة الجزائرية.";
            contentExamples =""
            break;
        case 'telegram':
            userContext = "إنشاء محتوى مناسب لقنوات ومجموعات تيليجرام، يركز على تنسيق واضح واستخدام فعال لخصائص الرسائل بطريقة تخلط بين اللغة العربية واللهجة الجزائرية. خصائص النص: أسلوب سردي يجعل المحتوى جذابًا وتفاعليًا، استخدام العناوين الفرعية والرموز لتنظيم المحتوى، تقسيم الفقرات لجعل القراءة مريحة، تدرج هرمي للعناوين الفرعية لعرض الموضوعات بشكل منطقي، استخدام القليل من الرموز التعبيرية (emojis) لتعزيز الفهم.";
            contentExamples = [
                {
                  title: "أزمة تسلا المالية عام 2008",
                  content: `
              في عام 2008، وعند محاولة إطلاق "رودستر"، أول سيارة من تسلا، تعرضت تسلا لأزمة مالية كبيرة وخطيرة كادت أن تؤدي إلى إفلاسها.
              كانت هذه الأزمة ناتجة عن عدة عوامل، أهمها:
              
              🔸 الأزمة المالية العالمية 2007 التي أثرت على العديد من الشركات عالميًا. أدت هذه الأزمة إلى نقص السيولة، مما جعل من الصعب دفع تكاليف الإنتاج ورواتب العاملين.
              
              🔸 ارتفاع تكاليف الإنتاج والتطوير نتيجة تحديات متعددة في سلسلة التوريد. أدى ذلك إلى تأخير في الإنتاج، ولم تتمكن تسلا من تسليم "رودستر" في الموعد المحدد، مما أثر سلبًا على إيرادات الشركة.
              
              🔸 ... (إكمال النص بنفس النمط)
              `
                },
                {
                  title: "حلول لإدارة المشاريع",
                  content: `
              غالبًا ما تواجه المشاريع تحديات غير متوقعة تؤثر على الجودة في التقديم والأداء، بالإضافة إلى تأخيرات في التسليم أو الحصول على نتائج غير مرغوبة. في المقال التالي، سنقدم لكم مجموعة من الحلول التي ستساعدكم في اكتشاف هذه العقبات ومعالجتها بسرعة وفعالية:
              
              1️⃣ جلسات دورية : تنظيم اجتماعات منتظمة لضمان سير العمل وفق الخطة. كل اجتماع يجب أن يركز على مراجعة المهام المكتملة، وتحديد العقبات، والتخطيط للخطوات القادمة. هذه الجلسات تساعد على إجراء التعديلات اللازمة في الوقت المناسب لتجنب المشاكل.
              
              2️⃣ استخدام أدوات إدارة المشاريع: أدوات مثل Asana وTrello تساعد في توزيع المهام بوضوح وتحديد المواعيد النهائية. كما توفر رؤية شاملة لتقدم المشروع، وتتيح للفريق تحديث حالة المهام بسهولة، مما يعزز التواصل بين الجميع📊
              
              3️⃣ ... (إكمال النص بنفس النمط)
              `
                },
                {
                  title: "نموذج العمل التجاري",
                  content: `
              كلٌّ منا لديه فكرة مشروع يريد تحقيقها، لكن المشكلة الأولى التي يواجهها هي كيف تكون هذه الفكرة مجسدة على أرض الواقع ومصدرًا لتحقيق الأرباح ☹️
              
              نموذج العمل التجاري أو ما يسمى بـ Business Model هو نموذج يمكنك من الحصول على رؤية شاملة وتوضيحية لفكرة مشروعك أو مؤسستك 🏢 وذلك من خلال أقسامه التسعة التي سنقوم بتوضيحها لكم فيما يلي:   
              
              1️⃣ شرائح العملاء (customers segments): ...  
              2️⃣ القيم المقترحة (Value Proposition): ...  
              3️⃣ ... (إكمال النص بنفس النمط)
              `
                }
              ];
              
            break;
        case 'facebook':
            userContext = "قم بإنشاء محتوى مناسب لقنوات ومجموعات تليجرام، مع التركيز على تنسيق واضح واستخدام فعّال لميزات الرسائل، بمزيج بين اللهجة العربية واللهجة الجزائرية.";
            contentExamples =""
            break;
        case 'linkedin':
            contentExamples =""
            break;
            case 'email':    
            userContext = "Créez un contenu optimisé pour les e-mails avec des lignes d'objet claires, un formatage approprié et des appels à l'action convaincants. Utilisez un ton formel et un formatage professionnel en français.";
            userContext = "Créez un contenu professionnel adapté à LinkedIn, en mettant l'accent sur la valeur commerciale et les analyses sectorielles. Utilisez un ton formel et un formatage professionnel en français.";
            contentExamples = [
                {
                "title": "أزمة شركة ناجحة في السوق",
                "content": {
                    "[مقدمة]": "في السنوات القليلة الماضية، كانت هناك شركة عريقة ناجحة لديها مصداقية في السوق وسمعة طيبة للمنتجات والخدمات العالية الجودة التي تقدمها إضافة إلى فريق كبير من الموظفين الأكفاء وقاعدة عملاء قوية...",
                    "[التحدي]": "فجأة دون سابق إنذار بدأ السوق يتغير ويظهر منافسون جدد بمنتجات جديدة مبتكرة، وبدأوا يخسرون الزبائن شيئًا فشيئًا. أرباح الشركة بدأت في الانخفاض، وأصبح الموظفون محبطين.",
                    "[الحل]": "إلى أن استعانوا بمؤسسة لديها خبرة في مساعدة الشركات على تشخيص مشاكلها ووضع خطة لمعالجتها.",
                    "[النتيجة]": "نفذ المسؤولون الخطة وبدأت الشركة ترى تغييرًا إيجابيًا في عملها، وعادت روح الأمل في نفوس الفريق، وبدأت الشركة في جني الأرباح مرة أخرى."
                }
                },
                {
                "title": "إدارة مشروع ليست بالأمر السهل",
                "content": {
                    "[مقدمة]": "إن إدارة مشروع ليست بالأمر السهل. عندما تبدأ مشروعك، قد تشعر بالحماس الكبير والرغبة في النجاح، لكن سرعان ما تجد نفسك تواجه تحديات غير متوقعة...",
                    "[التحدي]": "التحديات تشمل التسويق، إدارة الموارد المالية، أو تنظيم فريق العمل. هذه الأمور قد تصبح مرهقة وتؤدي إلى توقف تقدم المشروع.",
                    "[الحل]": "نوفر لك الحلول العملية التي تساعدك على التغلب على هذه التحديات بشكل فعال، من استراتيجيات التسويق إلى الإدارة المالية.",
                    "[الدعوة إلى التسجيل]": "سجل الآن ولا تدع التحديات تعرقل تقدم مشروعك. الآن هو الوقت المثالي لتعلم كيفية التعامل مع هذه المشكلات بفعالية وكفاءة."
                }
                },
                {
                "title": "إدارة التدفق النقدي - ابق في أمان",
                "content": {
                    "[تعريف]": "قبل التطرق إلى الخطوات العملية لا بأس من تعريف خفيف لمصطلح التدفق النقدي. تخيل أنك صاحب عربة تبيع العصائر في الشارع. ما تحصل عليه من بيع العصائر هو تدفق نقدي داخلي، وما تدفعه لشراء الفواكه هو تدفق نقدي خارجي.",
                    "[الخطوات العملية]": [
                    "01) تفاوض مع الموردين لدفع الديون في أطول مدة ممكنة.",
                    "02) قدم عروضًا خاصة للزبائن الذين يدفعون فواتيرهم مبكرًا.",
                    "03) حدد أولويات نفقات الشركة وابدأ بالعناصر الأكثر أهمية.",
                    "04) قم بمراقبة التدفقات الداخلية والخارجية بانتظام للتأكد من السيولة."
                    ],
                    "[النتيجة]": "من خلال تطبيق هذه النصائح ستكون قادرًا على الحفاظ على التدفق النقدي الإيجابي وضمان استمرارية شركتك."
                }
                }
            ]
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

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const ASSISTANT_ID = process.env.ASSISTANT_ID;

const apiKey = process.env.OPENAI_API_KEY;


// Initialize the OpenAI client with the API key
const openai = new OpenAI({
    apiKey: apiKey, // Use apiKey variable here
});

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

let threadId = null;

app.post('/api/openai', async (req, res) => {
    const { message } = req.body;

    try {
        // Create a thread if it doesn't exist
        if (!threadId) {
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
        }

        // Add the user's message to the thread
        await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });

        // Wait for the assistant to complete with timeout
        let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout

        while (runStatus.status !== 'completed' && runStatus.status !== 'failed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            attempts++;
        }

        if (attempts >= maxAttempts) {
            throw new Error('Assistant response timeout');
        }

        if (runStatus.status === 'failed') {
            throw new Error('Assistant run failed');
        }

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(threadId);
        const assistantResponse = messages.data[0].content[0].text.value;

        res.json({ message: assistantResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Failed to get assistant response' });
    }
});

app.post('/api/new-thread', async (req, res) => {
    try {
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        res.json({ message: 'New conversation started', threadId });
    } catch (error) {
        console.error('Error creating new thread:', error);
        res.status(500).json({ error: 'Failed to create new thread' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
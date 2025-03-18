require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize Telegram Bot
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
let bot;

// Only initialize the bot if the token is provided
if (telegramToken && telegramToken !== 'your_telegram_bot_token') {
  bot = new TelegramBot(telegramToken, { polling: true });
  
  // Bot command handlers
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Telegram Channel Analyzer Bot. Send me a channel URL or description to analyze if it might be fake.');
  });

  bot.onText(/\/analyze (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const channelInfo = match[1];
    
    bot.sendMessage(chatId, 'Analyzing the channel, please wait...');
    
    try {
      const analysis = await analyzeChannel(channelInfo, chatId);
      bot.sendMessage(chatId, analysis, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error analyzing channel:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error analyzing the channel. Please try again later.');
    }
  });

  // Handle all messages
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    // Skip command messages
    if (msg.text && msg.text.startsWith('/')) return;
    
    // If user sends a message that's not a command, treat it as channel info to analyze
    if (msg.text) {
      try {
        bot.sendMessage(chatId, 'Analyzing the channel information, please wait...');
        const analysis = await analyzeChannel(msg.text, chatId);
        bot.sendMessage(chatId, analysis, { parse_mode: 'Markdown' });
      } catch (error) {
        console.error('Error analyzing message:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error processing your request. Please try again later.');
      }
    }
  });
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for channel analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { channelInfo } = req.body;
    
    if (!channelInfo) {
      return res.status(400).json({ error: 'Channel information is required' });
    }
    
    // Generate a unique ID for this request to maintain chat history
    const requestId = Date.now().toString();
    
    const analysis = await analyzeChannel(channelInfo, requestId);
    
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the channel' });
  }
});

// Initialize chat history for each user
const userChats = {};

// Function to analyze channel using Gemini
async function analyzeChannel(channelInfo, userId) {
  // Initialize chat for this user if not exists
  if (!userChats[userId]) {
    userChats[userId] = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "I need you to analyze Telegram channels for potential fake content, especially in scientific contexts." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll help you analyze Telegram channels to identify potential fake content or misinformation in scientific contexts. Please provide details about the channel you want to analyze." }],
        },
      ],
    });
  }

  // Construct the analysis prompt
  const prompt = `Analyze this Telegram channel information to determine if it might be a fake channel: "${channelInfo}".

Please consider these key points in your analysis:
1. Check for signs of impersonation of official scientific publishers or journals
2. Identify suspicious patterns in content distribution or language
3. Analyze the consistency of the information with established scientific knowledge
4. Detect potential misinformation related to scientific topics
5. Consider whether the channel follows verified communication practices

Background context for your analysis:
- Telegram has evolved from a messaging app to a global information distribution platform
- Fake channels often imitate official sources, especially in scientific contexts
- The absence of centralized verification on Telegram facilitates the spread of misinformation
- Scientific communication requires rigorous verification and transparency

Provide a detailed analysis with a probability score (0-100%) of whether this is a fake channel, and provide specific reasons for your conclusion based on the text. Format your response with markdown for readability.`;

  // Send the prompt to Gemini
  const result = await userChats[userId].sendMessage(prompt);
  return result.response.text();
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Web interface available at: http://localhost:${PORT}`);
  
  if (!telegramToken || telegramToken === 'your_telegram_bot_token') {
    console.log('NOTE: Telegram bot not initialized. Set TELEGRAM_BOT_TOKEN in .env file to enable the bot.');
  } else {
    console.log('Telegram bot initialized and listening for messages.');
  }
});

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
}); 
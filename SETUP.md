# Setup Guide

Follow these steps to set up and run the Telegram Fake Channel Detector application:

## 1. Install dependencies

Run the following command to install all required dependencies:

```
npm install
```

## 2. Configure environment variables

The application uses a `.env` file for configuration. A default file is already created with the Gemini API key.

If you want to use the Telegram Bot feature, you need to:

1. Create a Telegram bot by talking to [@BotFather](https://t.me/botfather) on Telegram
2. Get your bot token and replace `your_telegram_bot_token` in the `.env` file

## 3. Run the application

Start the application with:

```
npm start
```

The application will be available at http://localhost:3000

## 4. Using the application

### Web Interface

1. Open your browser and navigate to http://localhost:3000
2. Enter a Telegram channel URL, name, or paste content from a channel
3. Click "Analyze Channel"
4. Review the detailed analysis

### Telegram Bot (if configured)

1. Start a chat with your bot on Telegram
2. Send the bot a channel URL or description
3. Receive an analysis directly in your Telegram chat

## Troubleshooting

- If the application can't connect to the Gemini API, check your internet connection and verify the API key in the `.env` file.
- If the Telegram bot isn't responding, make sure you've set the correct bot token in the `.env` file.
- For any other issues, check the console output for error messages. 
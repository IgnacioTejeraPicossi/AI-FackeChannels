# Telegram Fake Channel Detector

This application analyzes Telegram channels to detect potential fake content and misinformation, with a focus on scientific communication. It uses Google's Gemini 2.0 Flash API to provide intelligent analysis of channel content, helping users identify potentially misleading or fraudulent scientific channels.

## Features

- **Web Interface**: Input channel URLs or content for instant analysis
- **Telegram Bot**: Direct integration with Telegram for on-platform analysis
- **AI-Powered Analysis**: Leverages Google's Gemini 2.0 Flash for accurate detection
- **Scientific Focus**: Specialized in detecting misinformation in scientific contexts
- **Detailed Reports**: Provides probability scores and specific reasoning for each analysis

## Background

Telegram has evolved from a simple messaging app to a global information distribution platform used in media, education, and health contexts. While the platform's channel feature offers powerful communication tools, the lack of centralized verification facilitates the spread of fake channels and misinformation.

This application helps address these challenges by combining AI analysis with scientific verification principles to identify potential fake channels, particularly those impersonating scientific publishers or distributing misleading scientific information.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Gemini API key (provided in the config)
- (Optional) A Telegram Bot token for the bot functionality

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your environment variables:
   - The Gemini API key is already configured in the .env file
   - Add your Telegram Bot token if you want to use the bot functionality
   
4. Start the application:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Web Interface

1. Enter a Telegram channel URL, name, or paste content from a channel
2. Click "Analyze Channel"
3. Review the detailed analysis report with probability score

### Telegram Bot

1. Start a chat with the bot (@FakeChannelDetectorBot)
2. Send the bot a channel URL or description
3. Receive an analysis directly in your Telegram chat

## Technologies Used

- Node.js and Express for the backend
- Google's Gemini 2.0 Flash API for AI analysis
- Telegram Bot API for the bot functionality
- Bootstrap for the frontend UI

## How It Works

The application analyzes Telegram channels by:

1. Examining content for signs of impersonation of official sources
2. Identifying suspicious patterns in content distribution
3. Analyzing consistency with established scientific knowledge
4. Detecting potential misinformation related to scientific topics
5. Evaluating adherence to verified communication practices

## License

MIT

## Acknowledgments

- Google Gemini API
- Telegram Bot API 
- UGR 
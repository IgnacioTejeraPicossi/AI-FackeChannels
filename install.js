#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\x1b[36m%s\x1b[0m', '📱 Telegram Fake Channel Detector - Installation');
console.log('\x1b[36m%s\x1b[0m', '----------------------------------------------');

// Check Node.js version
const nodeVersion = process.version;
const versionNum = nodeVersion.slice(1).split('.')[0];

if (versionNum < 14) {
  console.log('\x1b[31m%s\x1b[0m', '❌ Error: Node.js version 14 or higher is required');
  console.log(`Current version: ${nodeVersion}`);
  console.log('Please update Node.js and try again.');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✅ Node.js version check passed');

// Function to install dependencies
function installDependencies() {
  console.log('\x1b[33m%s\x1b[0m', '📦 Installing dependencies...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('\x1b[32m%s\x1b[0m', '✅ Dependencies installed successfully');
    setupEnvironment();
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', '❌ Error installing dependencies');
    console.log(error.message);
    process.exit(1);
  }
}

// Function to set up environment
function setupEnvironment() {
  console.log('\x1b[33m%s\x1b[0m', '🔧 Setting up environment...');
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('Found existing .env file');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if it has GEMINI_API_KEY
    if (!envContent.includes('GEMINI_API_KEY=')) {
      envContent += '\nGEMINI_API_KEY=AIzaSyA1UDOPoKbQSWXCEki1slq4fZGIMA9MyyI';
    }
    
    // Ask for Telegram bot token
    rl.question('Do you want to configure the Telegram Bot? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question('Enter your Telegram Bot token (or press Enter to skip): ', (token) => {
          if (token) {
            if (envContent.includes('TELEGRAM_BOT_TOKEN=')) {
              envContent = envContent.replace(/TELEGRAM_BOT_TOKEN=.*/, `TELEGRAM_BOT_TOKEN=${token}`);
            } else {
              envContent += `\nTELEGRAM_BOT_TOKEN=${token}`;
            }
          }
          
          fs.writeFileSync(envPath, envContent);
          console.log('\x1b[32m%s\x1b[0m', '✅ Environment configured successfully');
          finishSetup();
        });
      } else {
        console.log('Skipping Telegram Bot configuration');
        finishSetup();
      }
    });
  } else {
    console.log('Creating new .env file');
    
    // Create default .env file
    const defaultEnv = 'GEMINI_API_KEY=AIzaSyA1UDOPoKbQSWXCEki1slq4fZGIMA9MyyI\nTELEGRAM_BOT_TOKEN=your_telegram_bot_token';
    fs.writeFileSync(envPath, defaultEnv);
    
    // Ask for Telegram bot token
    rl.question('Do you want to configure the Telegram Bot? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question('Enter your Telegram Bot token (or press Enter to skip): ', (token) => {
          if (token) {
            const updatedEnv = defaultEnv.replace('your_telegram_bot_token', token);
            fs.writeFileSync(envPath, updatedEnv);
          }
          
          console.log('\x1b[32m%s\x1b[0m', '✅ Environment configured successfully');
          finishSetup();
        });
      } else {
        console.log('Skipping Telegram Bot configuration');
        finishSetup();
      }
    });
  }
}

// Function to finish setup
function finishSetup() {
  console.log('\x1b[36m%s\x1b[0m', '\n----------------------------------------------');
  console.log('\x1b[32m%s\x1b[0m', '✅ Installation completed successfully!');
  console.log('\x1b[36m%s\x1b[0m', '----------------------------------------------');
  console.log('To start the application, run:');
  console.log('\x1b[33m%s\x1b[0m', 'npm start');
  console.log('\nThe application will be available at http://localhost:3000');
  console.log('\x1b[36m%s\x1b[0m', '----------------------------------------------');
  
  rl.close();
}

// Start installation
rl.question('This will install all necessary dependencies. Continue? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    installDependencies();
  } else {
    console.log('Installation cancelled.');
    rl.close();
  }
}); 
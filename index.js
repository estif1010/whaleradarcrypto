require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

// TELEGRAM BOT
const bot = new TelegramBot(
  process.env.BOT_TOKEN,
  { polling: true }
);

// CHANNEL ID
const CHANNEL_ID = process.env.CHANNEL_ID;

// WEB SERVER
app.get('/', (req, res) => {
  res.send('🐋 WhaleRadarCrypto Bot Running');
});

// START COMMAND
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    `
🐋 WhaleRadarCrypto Active

✅ Multi Chain Tracking
✅ Exchange Flow Alerts
✅ Auto Channel Posting
`
  );

});

// TEST WHALE ALERT
bot.onText(/\/whale/, async (msg) => {

  try {

    const message = `
🚨 Whale Transfer Detected

🐋 12,500 ETH moved

📤 Unknown Wallet
📥 Binance

💰 Estimated Value:
$45,000,000
`;

    // SEND TO CHANNEL
    await bot.sendMessage(
      CHANNEL_ID,
      message
    );

    // SEND TO USER
    await bot.sendMessage(
      msg.chat.id,
      '✅ Whale Alert Sent To Channel'
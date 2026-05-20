require('dotenv').config();

const TelegramBot =
require('node-telegram-bot-api');

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling: true }
);

const CHANNEL_ID =
process.env.CHANNEL_ID;

// START
bot.onText(/\/start/, (msg) => {

bot.sendMessage(
msg.chat.id,
'🐋 WhaleRadarCrypto Tracking Active'
);

});

// TEST WHALE ALERT
bot.onText(/\/whale/, async (msg) => {

const message = `
🚨 Whale Transfer Detected

🐋 12,500 ETH moved

📤 Unknown Wallet
📥 Binance

💰 Estimated Value:
$45,000,000
`;

await bot.sendMessage(
CHANNEL_ID,
message
);

bot.sendMessage(
msg.chat.id,
'✅ Whale Alert Sent'
);

});
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
'🐋 WhaleRadarCrypto Active'
);

});

// TEST SIGNAL
bot.onText(/\/test/, async (msg) => {

await bot.sendMessage(
CHANNEL_ID,
`
🚨 Whale Alert

🐋 5,000 BTC moved

📥 Binance
💰 $320M
`
);

bot.sendMessage(
msg.chat.id,
'✅ Signal Sent'
);

});
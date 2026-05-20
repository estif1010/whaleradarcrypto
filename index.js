const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

// EXPRESS SERVER
app.get('/', (req, res) => {
  res.send('🐋 WhaleRadarCrypto Running');
});

// CREATE BOT
const bot = new TelegramBot(
  process.env.BOT_TOKEN
);

// SAFE POLLING START
async function startBot() {

  try {

    // CLEAR OLD WEBHOOK/POLLING
    await bot.deleteWebHook();

    // START NEW POLLING
    await bot.startPolling();

    console.log('✅ Bot Started');

  } catch (err) {

    console.log(err);

  }

}

startBot();

// START COMMAND
bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`
🐋 WhaleRadarCrypto Active

✅ Auto Channel Posting
✅ ETH Whale Tracking
✅ Exchange Flow Monitoring
`
  );

});

// WHALE COMMAND
bot.onText(/\/
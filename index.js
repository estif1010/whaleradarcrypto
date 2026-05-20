const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

// EXPRESS SERVER
app.get('/', (req, res) => {
  res.send('WhaleRadarCrypto Running');
});

// CREATE BOT
const bot = new TelegramBot(
  process.env.BOT_TOKEN,
  { polling: false }
);

// START POLLING SAFELY
bot.startPolling();

// START COMMAND
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    '🐋 WhaleRadarCrypto Active'
  );

});

// WHALE COMMAND
bot.onText(/\/whale/, async (msg) => {

  try {

    await bot.sendMessage(
      process.env.CHANNEL_ID,
      '🚨 ETH Whale Alert'
    );

    await bot.sendMessage(
      msg.chat.id,
      '✅ Sent Successfully'
    );

  } catch (err) {

    console.log(err);

  }

});

// PORT
const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});
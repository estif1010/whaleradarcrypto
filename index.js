const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling: true }
);

// HOME PAGE
app.get('/', (req, res) => {
  res.send('WhaleRadarCrypto Running');
});

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
      '🚨 Whale Alert Working'
    );

    bot.sendMessage(
      msg.chat.id,
      '✅ Sent Successfully'
    );

  } catch (err) {

    console.log(err);

    bot.sendMessage(
      msg.chat.id,
      '❌ Error'
    );

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
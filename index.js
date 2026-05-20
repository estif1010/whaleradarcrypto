const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

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
    '🐋 WhaleRadarCrypto ETH Tracker Active'
  );

});

// TEST COMMAND
bot.onText(/\/whale/, async (msg) => {

  checkETHWhales();

});

// ETH WHALE TRACKER
async function checkETHWhales() {

  try {

    const response =
    await axios.get(
`https://api.etherscan.io/api?module=account&action=txlist&address=0x28C6c06298d514Db089934071355E5743bf21d60&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
    );

    const txs = response.data.result;

    for (const tx of txs) {

      const ethValue =
      Number(tx.value) / 1e18;

      // FILTER
      if (ethValue >= 100) {

        const message = `
🚨 ETH Whale Alert

🐋 ${ethValue.toFixed(2)} ETH moved

📤 ${tx.from.slice(0,6)}...
📥 ${tx.to.slice(0,6)}...

⛽ Gas Used:
${tx.gasUsed}

🔗 Ethereum Network
`;

        await bot.sendMessage(
          process.env.CHANNEL_ID,
          message
        );

      }

    }

  } catch (err) {

    console.log(err);

  }

}

//
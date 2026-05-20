const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const app = express();

// ======================
// EXPRESS SERVER
// ======================

app.get('/', (req, res) => {
  res.send('🐋 WhaleRadarCrypto Running');
});

// ======================
// TELEGRAM BOT
// ======================

const bot = new TelegramBot(
  process.env.BOT_TOKEN
);

// SAFE POLLING
async function startBot() {

  try {

    await bot.deleteWebHook();

    await bot.startPolling();

    console.log('✅ Bot Started');

  } catch (err) {

    console.log(err);

  }

}

startBot();

// ======================
// START COMMAND
// ======================

bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`
🐋 WhaleRadarCrypto Active

✅ ETH Whale Tracking
✅ TRON USDT Tracking
✅ Exchange Flow Alerts
✅ Auto Channel Posting
✅ Multi Chain Monitoring
`
  );

});

// ======================
// MANUAL TEST
// ======================

bot.onText(/\/whale/, async (msg) => {

  await bot.sendMessage(
    process.env.CHANNEL_ID,
`
🚨 Whale Alert Test

🐋 1,500 ETH moved

📤 Unknown Wallet
📥 Binance
`
  );

});

// ======================
// ETH WHALE TRACKER
// ======================

async function checkETHWhales() {

  try {

    const response =
    await axios.get(
`https://api.etherscan.io/api?module=account&action=txlist&address=0x28C6c06298d514Db089934071355E5743bf21d60&startblock=0&endblock=99999999&page=1&offset=3&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
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

⛽ Gas:
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

// ======================
// TRON USDT TRACKER
// ======================

async function checkTRONWhales() {

  try {

    const response =
    await axios.get(
'https://api.trongrid.io/v1/accounts/TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT/transactions/trc20'
    );

    const txs = response.data.data;

    for (const tx of txs) {

      const value =
      Number(tx.value) / 1e6;

      // FILTER
      if (value >= 100000) {

        const message = `
🚨 USDT Whale Alert

💵 ${value.toLocaleString()} USDT moved

📤 ${tx.from.slice(0,6)}...
📥 ${tx.to.slice(0,6)}...

🔗 TRON Network
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

// ======================
// AUTO TRACKING
// ======================

// ETH CHECK
setInterval(() => {

  checkETHWhales();

}, 300000);

// TRON CHECK
setInterval(() => {

  checkTRONWhales();

}, 300000);

// ======================
// SERVER PORT
// ======================

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server Running On Port ${PORT}`
  );

});
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

// ======================
// EXPRESS SERVER
// ======================

app.get('/', (req, res) => {
  res.send('TikTok Downloader Bot Running');
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
🎬 TikTok Downloader Bot

✅ Send TikTok Video Link
✅ Download Without Watermark
✅ Fast Download
✅ HD Quality

📥 Paste TikTok URL Now
`
  );

});

// ======================
// TIKTOK LINK DETECTION
// ======================

bot.on('message', async (msg) => {

  const text = msg.text;

  if (
    text &&
    (
      text.includes('tiktok.com')
      ||
      text.includes('vm.tiktok.com')
    )
  ) {

    try {

      await bot.sendMessage(
        msg.chat.id,
        '⏳ Downloading Video...'
      );

      // FREE TIKTOK DOWNLOAD API
      const api =
`https://tikwm.com/api/?url=${encodeURIComponent(text)}`;

      const response =
      await fetch(api);

      const data =
      await response.json();

      // VIDEO URL
      const videoUrl =
      data.data.play;

      // SEND VIDEO
      await bot.sendVideo(
        msg.chat.id,
        videoUrl,
        {
          caption:
`✅ Downloaded Successfully

⚡ Powered By espark downloader `
        }
      );

    } catch (err) {

      console.log(err);

      await bot.sendMessage(
        msg.chat.id,
        '❌ Failed To Download Video'
      );

    }

  }

});

// ======================
// PORT
// ======================

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server Running On ${PORT}`
  );

});
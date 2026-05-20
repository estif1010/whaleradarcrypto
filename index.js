const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

// ======================
// EXPRESS SERVER
// ======================

app.get('/', (req, res) => {
  res.send('WhaleRadarCrypto TikTok Bot Running');
});

// ======================
// TELEGRAM BOT
// ======================

const bot = new TelegramBot(
  process.env.BOT_TOKEN
);

// ======================
// START BOT
// ======================

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
// FORCE JOIN CHECK
// ======================

async function isUserJoined(userId) {

  try {

    const member =
    await bot.getChatMember(
      process.env.CHANNEL_USERNAME,
      userId
    );

    return (
      member.status === 'member' ||
      member.status === 'administrator' ||
      member.status === 'creator'
    );

  } catch (err) {

    return false;

  }

}

// ======================
// START COMMAND
// ======================

bot.onText(/\/start/, async (msg) => {

  const joined =
  await isUserJoined(msg.from.id);

  // FORCE JOIN
  if (!joined) {

    return bot.sendMessage(
      msg.chat.id,
`
🚨 Join Our Channel First

👇 Then Use The Bot
`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📢 Join Channel',
                url: `https://t.me/${process.env.CHANNEL_USERNAME.replace('@','')}`
              }
            ],
            [
              {
                text: '✅ Joined',
                callback_data: 'check_join'
              }
            ]
          ]
        }
      }
    );

  }

  // WELCOME IMAGE
  await bot.sendPhoto(
    msg.chat.id,
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    {
      caption:
`
╔══════════════════╗
   🎬 TIKTOK DOWNLOADER
╚══════════════════╝

⚡ Fast Downloads
💎 No Watermark
🎥 HD Quality
📥 Unlimited Usage

🚀 Send TikTok Link Now
`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📢 Official Channel',
              url: `https://t.me/${process.env.CHANNEL_USERNAME.replace('@','')}`
            }
          ]
        ]
      }
    }
  );

});

// ======================
// CHECK JOIN BUTTON
// ======================

bot.on('callback_query', async (query) => {

  if (query.data === 'check_join') {

    const joined =
    await isUserJoined(query.from.id);

    if (!joined) {

      return bot.answerCallbackQuery(
        query.id,
        {
          text:
'❌ You Must Join Channel First',
          show_alert: true
        }
      );

    }

    await bot.answerCallbackQuery(
      query.id,
      {
        text:
'✅ Access Granted'
      }
    );

    await bot.sendMessage(
      query.message.chat.id,
`
✅ You Can Now Use The Bot

📥 Send TikTok Link
`
    );

  }

});

// ======================
// DOWNLOAD COUNTER
// ======================

let downloadCount = 0;

// ======================
// MESSAGE HANDLER
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

    const joined =
    await isUserJoined(msg.from.id);

    if (!joined) {

      return bot.sendMessage(
        msg.chat.id,
        '❌ Join Channel First'
      );

    }

    try {

      // UPLOAD EFFECT
      await bot.sendChatAction(
        msg.chat.id,
        'upload_video'
      );

      await bot.sendMessage(
        msg.chat.id,
`
⏳ Processing Video...

⚡ HD Quality Detection
💎 Removing Watermark
`
      );

      // TIKTOK API
      const api =
`https://tikwm.com/api/?url=${encodeURIComponent(text)}`;

      const response =
      await fetch(api);

      const data =
      await response.json();

      const videoUrl =
      data.data.play;

      downloadCount++;

      // SEND VIDEO
      await bot.sendVideo(
        msg.chat.id,
        videoUrl,
        {
          caption:
`
╔══════════════════╗
    ✅ DOWNLOAD READY
╚══════════════════╝

🎥 HD Quality
💎 No Watermark
⚡ Fast Download

📥 Total Downloads:
${downloadCount}

🚀 Powered By
espark downloader
`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📢 Join Channel',
                  url: `https://t.me/${process.env.CHANNEL_USERNAME.replace('@','')}`
                }
              ]
            ]
          }
        }
      );

    } catch (err) {

      console.log(err);

      await bot.sendMessage(
        msg.chat.id,
`
❌ Download Failed

⚠️ Try Another TikTok Link
`
      );

    }

  }

});

// ======================
// SERVER
// ======================

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server Running On ${PORT}`
  );

});
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const youtubedl = require('youtube-dl-exec');

const app = express();

// ======================
// EXPRESS SERVER
// ======================

app.get('/', (req, res) => {
  res.send('WhaleRadarCrypto Bot Running');
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
                url:
`https://t.me/${process.env.CHANNEL_USERNAME.replace('@','')}`
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

  // WELCOME MESSAGE
  await bot.sendMessage(
    msg.chat.id,
`
╔══════════════════╗
   🎬 MULTI DOWNLOADER
╚══════════════════╝

✅ TikTok Downloader
✅ YouTube Downloader
✅ HD Quality
✅ Fast Download

📥 Send Video Link Now
`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📢 Official Channel',
              url:
`https://t.me/${process.env.CHANNEL_USERNAME.replace('@','')}`
            }
          ]
        ]
      }
    }
  );

});

// ======================
// JOIN CHECK BUTTON
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

📥 Send Video Link
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

  // ======================
  // TIKTOK DOWNLOADER
  // ======================

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

      await bot.sendChatAction(
        msg.chat.id,
        'upload_video'
      );

      await bot.sendMessage(
        msg.chat.id,
`
⏳ Processing TikTok Video...

💎 Removing Watermark
🎥 HD Quality Detection
`
      );

      const api =
`https://tikwm.com/api/?url=${encodeURIComponent(text)}`;

      const response =
      await fetch(api);

      const data =
      await response.json();

      const videoUrl =
      data.data.play;

      downloadCount++;

      await bot.sendVideo(
        msg.chat.id,
        videoUrl,
        {
          caption:
`
╔══════════════════╗
   ✅ TIKTOK READY
╚══════════════════╝

🎥 HD Quality
💎 No Watermark

📥 Total Downloads:
${downloadCount}

🚀 Powered By
Espark downloader 
`
        }
      );

    } catch (err) {

      console.log(err);

      await bot.sendMessage(
        msg.chat.id,
`
❌ TikTok Download Failed

⚠️ Try Another Link
`
      );

    }

  }

  // ======================
  // YOUTUBE DOWNLOADER
  // ======================

  if (
    text &&
    (
      text.includes('youtube.com')
      ||
      text.includes('youtu.be')
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

      await bot.sendChatAction(
        msg.chat.id,
        'upload_video'
      );

      await bot.sendMessage(
        msg.chat.id,
`
⏳ Processing YouTube Video...

🎥 Fetching HD Quality
`
      );

      const info =
      await youtubedl(
        text,
        {
          dumpSingleJson: true,
          noWarnings: true,
          preferFreeFormats: true
        }
      );

      const videoUrl =
      info.url;

      downloadCount++;

      await bot.sendVideo(
        msg.chat.id,
        videoUrl,
        {
          caption:
`
╔══════════════════╗
   ✅ YOUTUBE READY
╚══════════════════╝

🎥 HD Quality
⚡ Fast Download

📥 Total Downloads:
${downloadCount}

🚀 Powered By
Espark downloader 
`
        }
      );

    } catch (err) {

      console.log(err);

      await bot.sendMessage(
        msg.chat.id,
`
❌ YouTube Download Failed

⚠️ Video May Be Restricted
🔁 Try Another Link
`
      );

    }

  }

  // ======================
  // TIKTOK USERNAME SEARCH
  // ======================

  if (
    text &&
    text.startsWith('@')
  ) {

    const username =
    text.replace('@', '');

    return bot.sendMessage(
      msg.chat.id,
`
🔍 TikTok Profile Found

👤 Username:
@${username}

🌐 Open Profile:
https://www.tiktok.com/@${username}

🚀 Powered By
WhaleRadarCrypto
`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎬 Open TikTok Profile',
                url:
`https://www.tiktok.com/@${username}`
              }
            ]
          ]
        }
      }
    );

  }

});

// ======================
// SERVER
// ======================

const PORT =
process.env.PORT || 3000;

app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `🚀 Server Running On ${PORT}`
    );

  }
);
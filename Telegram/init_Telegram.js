import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import get_reddit from '../functions/get_reddit.js';
import get_dadjoke from '../functions/get_dadjoke.js';
import 'dotenv/config';

/*
meme - Returns a random HOT meme from Reddit (May not be funny)
dadjoke - You wanna hear a dad joke?
lengthen - Lengthen a shortened URL (/lengthen URL)
*/

async function init_Telegram() {
  const bot = new Telegraf(process.env.TG_TOKEN);
  bot.start((ctx) => ctx.reply('Hello there! I am alive!'));
  bot.help((ctx) => ctx.reply('Send me a sticker! or did you come here to say hi to me? Look at the command menu for more.'));
  bot.on(message('sticker'), (ctx) => ctx.reply('👍', { reply_to_message_id: ctx.message.message_id }));
  bot.command('meme', async (ctx) => {
    const meme = await get_reddit();
    ctx.reply(meme);
  });
  bot.command('dadjoke', async (ctx) => {
    const joke = await get_dadjoke();
    ctx.reply(joke);
  });
  bot.hears('hi', (ctx) => ctx.reply('Hey there'));
  bot.launch();
  console.log('Telegram: Bot initialized.');

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

export default init_Telegram;

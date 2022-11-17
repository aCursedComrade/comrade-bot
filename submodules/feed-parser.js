import { read } from 'feed-reader';
import { EmbedBuilder, TextChannel, WebhookClient } from 'discord.js';
import bot_client from '../client.js';
import logclass from '../logger.js';
import RSSObj from '../models/RSSObj.js';

const logger = new logclass();
const INTERVAL = 1000 * 60 * 10;

// Validate and return the latest entry at initial setup
/**
 * @param {String} url
 * @returns {Promise<string | undefined>}
 */
export async function get_latest(url) {
  try {
    const feeddata = await read(url, { descriptionMaxLen: 100 });
    return feeddata.entries[0].title;
  }
  catch {
    return undefined;
  }
}

// Find or return a webhook of specified name
/**
 * @param {string} hook_name
 * @param {import('discord.js').TextChannel} channel
 * @returns {Promise<import('discord.js').WebhookClient | import('discord.js').Webhook>} A WebHook object
 */
async function get_hook(hook_name, channel) {
  const webhooks = await channel.fetchWebhooks();
  const find_hook = webhooks.find(hook => hook.name === hook_name);
  if (find_hook) {
    return new WebhookClient({ url: find_hook.url });
  }
  else {
    return await channel.createWebhook({ name: hook_name });
  }
}

export async function feedReader() {
  setInterval(() => {
    RSSObj.find().exec(async (error, feed_list) => {
      if (error) { logger.error('Feed Parser: ' + error.message); }
      try {
        for (const item of feed_list) {
          const result = await read(item.rss_source, { descriptionMaxLen: 300 });
          const guild = bot_client.guilds.cache.get(item.guild_id);
          const channel = await bot_client.channels.cache.get(item.channel_id).fetch();
          if (guild != undefined && channel == TextChannel.prototype && result != undefined) {

            // create or fetch the appropiate webhook to post
            const webhook = await get_hook(`${bot_client.user.tag} - RSS`, channel);
            // console.log(webhook);

            // find the index of the last update
            const last_update = result.entries.findIndex((entry) => entry.title == item.last_update);
            let new_entries = [];

            if (last_update >= 0) {
              // slice the array of entries upto the last update
              new_entries = result.entries.slice(0, last_update);
            }
            else {
              // else take the top 5 if somehow we cannot find the last update (theres a lot of updates)
              new_entries = result.entries.slice(0, 5);
            }

            // reverse the entries the so older ones are posted first
            for (const entry of new_entries.reverse()) {
              const event_embed = new EmbedBuilder()
                .setAuthor({ name: result.title, url: result.link })
                .setTitle(entry.title)
                .setURL(entry.link)
                .setDescription(entry.description);
              await webhook.send({
                avatarURL: bot_client.user.displayAvatarURL({ size: 4096 }),
                embeds: [event_embed.data],
              });
            }

            // take first latest entry and update the databse regardless of the above
            RSSObj.findByIdAndUpdate(item._id, { last_update: result.entries[0].title.toString() }).exec((err) => {
              if (err) {
                console.error(err.message);
              }
            });
          }
        }
      }
      catch (parse_error) {
        logger.error('Feed parser: ' + parse_error.message);
      }
    });
    // logger.log('Feed Parser: Job done.');
  }, INTERVAL);
}

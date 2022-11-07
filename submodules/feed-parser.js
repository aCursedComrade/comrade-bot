import { read } from 'feed-reader';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import bot_client from '../client.js';
import logclass from '../logger.js';
import RSSObj from '../models/RSSObj.js';

const logger = new logclass();
const INTERVAL = 1000 * 60 * 10;

export async function feedReader() {
  setInterval(() => {
    try {
      RSSObj.find().exec((error, feed_list) => {
        if (error) logger.error('Feed Parser: ' + error.message);
        for (const item of feed_list) {
          read(item.rss_source, { descriptionMaxLen: 300 })
            .then(async (result) => {
              const last_update = DateTime.fromISO(item.last_update);
              // const last_update = new Date(result.entries[3].published);
              let latest = DateTime.now();
              // console.log('Last update:', last_update);
              const channel = bot_client.channels.cache.get(item.channel_id);
              if (!(channel == undefined)) {
                for (const entry of result.entries.reverse()) {
                  latest = DateTime.fromISO(entry.published);
                  // console.log('Latest:', latest);
                  if (latest > last_update) {
                    const event_embed = new EmbedBuilder()
                      .setAuthor({ name: result.title, url: result.link })
                      .setTitle(entry.title)
                      .setURL(entry.link)
                      .setDescription(entry.description)
                      .setTimestamp(new Date(entry.published));
                    await channel.send({ embeds: [event_embed.data] });
                  }
                }
                if (latest > last_update) {
                  RSSObj.findByIdAndUpdate(item._id, { last_update: latest.toISO() }).exec((err) => {
                    if (err) {
                      console.error(err);
                    }
                  });
                }
              }
              else {
                logger.error(`Channel ID: ${item.channel_id} unresolvable, passing.`);
              }
            })
            .catch((feed_error) => {
              logger.error('Feed Parser: Error when reading source.');
              console.error(feed_error);
            });
        }
      });
    }
    catch (error) {
      logger.error('Feed Parser: ' + error.message);
      console.error(error);
    }
    logger.log('Feed Parser: Job done.');
  }, INTERVAL);
}

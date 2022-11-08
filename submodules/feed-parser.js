import { read } from 'feed-reader';
import { EmbedBuilder } from 'discord.js';
import bot_client from '../client.js';
import logclass from '../logger.js';
import RSSObj from '../models/RSSObj.js';

const logger = new logclass();
const INTERVAL = 1000 * 30; // * 10;

export async function feedReader() {
  setInterval(() => {
    try {
      RSSObj.find().exec(async (error, feed_list) => {
        if (error) logger.error('Feed Parser: ' + error.message);
        for (const item of feed_list) {
          await read(item.rss_source, { descriptionMaxLen: 400 })
            .then(async (result) => {
              const channel = bot_client.channels.cache.get(item.channel_id);
              if (channel != undefined && result.entries != undefined) {

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
                    .setDescription(entry.description)
                    .setTimestamp(new Date(entry.published));
                  await channel.send({ embeds: [event_embed.data] });
                }

                // take first latest entry and update the databse regardless of the above
                RSSObj.findByIdAndUpdate(item._id, { last_update: result.entries[0].title.toString() }).exec((err) => {
                  if (err) {
                    console.error(err);
                  }
                });
              }
              else {
                logger.error(`${item.channel_id} || ${item.rss_source} unresolvable, passing.`);
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
    // logger.log('Feed Parser: Job done.');
  }, INTERVAL);
}

// Validate and return the 5th latest entry at initial setup
/**
 * @param {String} url
 */
export async function get_latest4(url) {
  const feeddata = await read(url, { descriptionMaxLen: 100 }).catch(() => { return undefined; });
  return feeddata == undefined ? undefined : feeddata.entries[4].title;
}

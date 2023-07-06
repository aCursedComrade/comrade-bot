import { extract } from '@extractus/feed-extractor';
import { EmbedBuilder } from 'discord.js';
import client from '../Discord/client.js';
import RSSObj from '../models/RSSObj.js';
import { timeout } from '../functions/util.js';

const INTERVAL = 1000 * 60 * 30;

// Validate and return the latest entry at initial setup
/**
 * @param {String} url
 * @returns {Promise<Date | undefined>}
 */
export async function get_latest(url) {
    try {
        const feeddata = await extract(url, { descriptionMaxLen: 100, useISODateFormat: true, normalization: true });
        return feeddata.entries[0].published;
    }
    catch {
        return undefined;
    }
}

/**
 * @param {{ _id: any, rss_source: String, channel_id: String, guild_id: String, last_update: Date }} record
 * @returns {Promise<void>}
 */
async function postEvents(record) {
    const result = await extract(record.rss_source, { descriptionMaxLen: 200, useISODateFormat: true, normalization: true }, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://www.google.com',
        },
    }).catch(function (read_error) {
        console.error(`Feed Parser (read: ${record.rss_source}): ${read_error.message}`);
    });

    if (typeof result != 'undefined') {

        for (const entry of result.entries.reduce(function (filtered, post) {
            if (Number.isNaN(record.last_update.valueOf())) {
                const offset = new Date(Date.now());
                offset.setUTCDate(offset.getUTCDate() - 1);

                post.published > offset ? filtered.push(post) : null;
            }
            else {
                post.published > record.last_update ? filtered.push(post) : null;
            }

            return filtered;
        }, [])) {
            const event_embed = new EmbedBuilder()
                .setAuthor({ name: result.title, url: result.link || null })
                .setTitle(entry.title)
                .setURL(entry.link)
                .setDescription(entry.description);
            try {

                client.channels.fetch(record.channel_id).then(channel => {
                    if (channel.isTextBased()) {
                        channel.send({ embeds: [event_embed.data] });
                    }
                });
            }
            catch (post_error) {
                console.error(`Feed Parser (post): ${post_error.message}`);
            }

            await timeout(1000 * 5);
        }

        RSSObj.findByIdAndUpdate(record._id, { last_update: result.entries[0].published }).catch((error) => {
            console.error(`Feed Parser (update): ${error.message}`);
        });
    }
}

async function feedReader() {
    setInterval(() => {
        RSSObj.find().then(async (feed_list) => {
            for (const record of feed_list) {
                postEvents(record.toJSON());
            }
        }).catch((error) => {
            console.error(`Feed Parser (db_read): ${error.message}`);
        });
    }, INTERVAL);
}

export default feedReader;

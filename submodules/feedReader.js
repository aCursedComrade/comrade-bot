import { extract } from '@extractus/feed-extractor';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import client from '../Discord/client.js';
import RSSObj from '../models/RSSObj.js';
import { sleep } from '../functions/util.js';

const INTERVAL = 1000 * 60 * 30;

// Validate and return the latest entry at initial setup
/**
 * @param {String} url
 * @returns {Promise<Date | undefined>}
 */
export async function getLatest(url) {
    try {
        const feeddata = await extract(url, { descriptionMaxLen: 100, useISODateFormat: true });
        return feeddata.entries[0].published;
    } catch {
        return undefined;
    }
}

/**
 * @param {{
 * _id: any,
 * rss_source: String,
 * channel_id: String,
 * guild_id: String,
 * last_update: Date,
 * webhookId: String,
 * webhookToken: String,
 * }} record
 * @returns {Promise<void>}
 */
async function postEvents(record) {
    // grab new FeedData
    const result = await extract(
        record.rss_source,
        { descriptionMaxLen: 200, useISODateFormat: true },
        {
            headers: {
                'User-Agent': 'Comrade-Bot https://github.com/aCursedComrade/Comrade-Bot',
                Accept: 'text/html,application/xhtml+xml,application/xml',
            },
        },
    ).catch((errror) => {
        console.error(`Feed Parser (read: ${record.rss_source}): ${errror.message}`);
    });

    if (result) {
        // reduce the result to new entries
        const newData = result.entries.reduce(
            /**
             * @param {import('@extractus/feed-extractor').FeedEntry[]} filtered
             * @param {import('@extractus/feed-extractor').FeedEntry} post
             * @returns {import('@extractus/feed-extractor').FeedEntry[]}
             */
            function (filtered, post) {
                post.published > record.last_update ? filtered.push(post) : null;

                return filtered;
            },
            [],
        );

        const webhook = new WebhookClient({ id: record.webhookId, token: record.webhookToken });

        // post new entries
        for (const entry of newData.reverse()) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: result.title, url: result.link || null })
                .setTitle(entry.title)
                .setURL(entry.link)
                .setDescription(entry.description || 'No description')
                .setTimestamp(entry.published);

            webhook.send({
                username: client.user.username,
                avatarURL: client.user.avatarURL({ size: 256 }),
                embeds: [embed],
            });

            await sleep(2000);
        }

        // update the last_update field with the newest entry
        RSSObj.findByIdAndUpdate(record._id, { last_update: result.entries[0].published }).catch((error) => {
            console.error(`Feed Parser (update): ${error.message}`);
        });
    }
}

async function feedReader() {
    setInterval(() => {
        console.log(`FeedReader run: ${new Date(Date.now()).toISOString()}`);
        RSSObj.find()
            .then((feed_list) => {
                for (const record of feed_list) {
                    postEvents(record.toJSON());
                }
            })
            .catch((error) => {
                console.error(`Feed Parser (db_read): ${error.message}`);
            });
    }, INTERVAL);
}

export default feedReader;

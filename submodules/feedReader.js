import { extract } from '@extractus/feed-extractor';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import client from '../Discord/client.js';
import RSSEntry from '../models/RSSObj.js';
import { sleep } from '../functions/util.js';

// Validate and return the latest entry at initial setup
/**
 * @param {String} url
 * @returns {Promise<Date | undefined>}
 */
export async function getLatest(url) {
    try {
        const feeddata = await extract(url, { useISODateFormat: false });
        return feeddata.entries[3].published;
    } catch (error) {
        console.error(`Feed lookup: ${error.message}`);
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
        { descriptionMaxLen: 200, useISODateFormat: false },
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
                Date.parse(post.published.toString()) > record.last_update.valueOf() ? filtered.push(post) : null;

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
                .setTimestamp(Date.parse(entry.published.toString()));

            webhook.send({
                username: client.user.username,
                avatarURL: client.user.avatarURL({ size: 256 }),
                embeds: [embed],
            }).catch((error) => {
                console.error(`Feed Parser: (webhook): ${error.message}`);
            });

            await sleep(1000);
        }

        // update the last_update field with the newest entry
        RSSEntry.findByIdAndUpdate(record._id, { last_update: result.entries[0].published }).catch((error) => {
            console.error(`Feed Parser (update): ${error.message}`);
        });
    }
}

async function feedReader() {
    setInterval(() => {
        RSSEntry.find()
            .then((feed_list) => {
                for (const record of feed_list) {
                    postEvents(record.toJSON());
                }
            })
            .catch((error) => {
                console.error(`Feed Parser (db_read): ${error.message}`);
            });
    }, Number.parseInt(process.env.INTERVAL, 10));
}

export default feedReader;

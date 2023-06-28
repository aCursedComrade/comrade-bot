import { extract } from '@extractus/feed-extractor';
import { ChannelType, EmbedBuilder, WebhookClient } from 'discord.js';
import client from '../Discord/client.js';
import RSSObj from '../models/RSSObj.js';

const INTERVAL = 1000 * 60 * 30;

// Validate and return the latest entry at initial setup
/**
 * @param {String} url
 * @returns {Promise<string | undefined>}
 */
export async function get_latest(url) {
    try {
        const feeddata = await extract(url, { descriptionMaxLen: 100 });
        return feeddata.entries[0].title;
    }
    catch {
        return undefined;
    }
}

// Find or return a webhook of specified name
/**
 * @param {string} hook_name
 * @param {import('discord.js').Channel} channel
 * @returns {Promise<import('discord.js').WebhookClient | import('discord.js').Webhook>} A WebHook object
 */
async function get_hook(hook_name, channel) {
    const getchnl = await channel.fetch();
    if (getchnl.type == ChannelType.GuildText) {
        const webhooks = await getchnl.fetchWebhooks();
        const find_hook = webhooks.find(hook => hook.name === hook_name);
        if (find_hook?.token) {
            return new WebhookClient({ url: find_hook.url });
        }
        else {
            return await getchnl.createWebhook({ name: hook_name });
        }
    }
}

async function postEvents(feed_list) {
    const WEBHOOK = `RSS Event (${client.user.username})`;
    for (const item of feed_list) {
        const result = await extract(item.rss_source, { descriptionMaxLen: 200 }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml',
                'Upgrade-Insecure-Requests': '1',
                'Referer': 'https://www.google.com',
            },
        }).catch(function(read_error) {
            console.error(`Feed Parser (read: ${item.rss_source}): ${read_error.message}`);
        });

        if (result == null || undefined) {
            continue;
        }

        // const guild = discord_client.guilds.cache.get(item.guild_id);
        const channel = client.channels.cache.get(item.channel_id);
        if (channel && result) {
            // create or fetch the appropiate webhook to post
            const webhook = await get_hook(WEBHOOK, channel);
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
                    .setAuthor({ name: result.title, url: result.link || null })
                    .setTitle(entry.title)
                    .setURL(entry.link)
                    .setDescription(entry.description);
                try {
                    await webhook.send({
                        avatarURL: client.user.displayAvatarURL({ size: 4096 }),
                        embeds: [event_embed.data],
                    });
                }
                catch (post_error) {
                    console.error(`Feed Parser (post): ${post_error.message}`);
                }
            }

            // take latest entry and update the databse regardless of the above
            // previous posts may be emitted again if the feed author updated the post
            if (result) {
                RSSObj.findByIdAndUpdate(item._id, { last_update: result.entries[0].title }).catch((error) => {
                    console.error(`Feed Parser (update): ${error.message}`);
                });
            }
        }
    }
}

async function feedReader() {
    setInterval(() => {
        RSSObj.find().then(async (feed_list) => {
            await postEvents(feed_list);
        }).catch((error) => {
            console.error(`Feed Parser (db_read): ${error.message}`);
        });
    }, INTERVAL);
}

export default feedReader;

import { SlashCommandBuilder, EmbedBuilder, ChannelType, WebhookClient } from 'discord.js';
import RSSEntry from '../../models/RSSObj.js';
import { getLatest } from '../../submodules/feedReader.js';
import client from '../client.js';

export const data = new SlashCommandBuilder()
    .setName('rss')
    .setDMPermission(false)
    .setDescription('RSS event management.')
    .addSubcommand((subcmd) =>
        subcmd
            .setName('create')
            .setDescription('Set up a RSS feed (RSS/Atom/JSON).')
            .addChannelOption((option) =>
                option.setName('channel').setDescription('Select the channel to post events.').setRequired(true).addChannelTypes(ChannelType.GuildText),
            )
            .addStringOption((option) =>
                option.setName('url').setDescription('URL of the rss feed.').setRequired(true),
            ),
    )
    .addSubcommand((subcmd) =>
        subcmd
            .setName('delete')
            .setDescription('Delete a configured RSS source.')
            .addStringOption((option) =>
                option.setName('rss-id').setDescription('Use the "/rss list" command to get the ID.').setRequired(true),
            ),
    )
    .addSubcommand((subcmd) => subcmd.setName('list').setDescription('List all RSS feeds configured for the guild.'));

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    const user = await interaction.guild.members.fetch(interaction.user.id);
    if (interaction.options.getSubcommand() === 'create') {
        if (user.permissions.has('ManageWebhooks')) {
            await interaction.deferReply();
            const channel = interaction.options.getChannel('channel');
            const feed_url = interaction.options.getString('url').toString();
            const fetch_channel = await client.channels.fetch(channel.id);

            try {
                const last_entry = await getLatest(feed_url);
                if (last_entry != undefined && fetch_channel.type == ChannelType.GuildText) {
                    const webhook = { id: '', token: '' };

                    await RSSEntry.findOne({ channel_id: fetch_channel.id }).then(async (record) => {
                        if (record) {
                            webhook.id = record.webhookId;
                            webhook.token = record.webhookToken;
                        } else {
                            const new_hook = await fetch_channel.createWebhook({ name: client.user.username, avatar: client.user.avatar });
                            webhook.id = new_hook.id;
                            webhook.token = new_hook.token;
                        }
                    });

                    const rss_record = new RSSEntry({
                        guild_id: interaction.guild.id,
                        channel_id: channel.id,
                        rss_source: feed_url,
                        last_update: last_entry,
                        webhookId: webhook.id,
                        webhookToken: webhook.token,
                    });
                    rss_record.save();

                    await interaction.editReply(
                        `Feed events from \`${feed_url}\` will be posted in <#${channel.id}> from now on.`,
                    );
                } else {
                    await interaction.editReply(
                        `Unable to resolve \`${feed_url}\` as a RSS feed. It could be an invalid RSS feed or a server-side error.`,
                    );
                }
            } catch (error) {
                console.error(error.message);
                await interaction.editReply('An error occured');
            }
        } else {
            await interaction.reply({
                content: 'Sorry, only users with `Manage Webhooks` permission can do this!.',
                ephemeral: true,
            });
        }
    }

    if (interaction.options.getSubcommand() === 'delete') {
        if (user.permissions.has('ManageWebhooks')) {
            await interaction.deferReply();
            const rssId = interaction.options.getString('rss-id');

            RSSEntry.findByIdAndDelete(rssId, { new: true })
                .then(async (entry) => {
                    RSSEntry.countDocuments({ channel_id: entry.channel_id }).then((count) => {
                        if (count == 0) {
                            const webhook = new WebhookClient({ id: entry.webhookId, token: entry.webhookToken });
                            webhook.delete();
                        }
                    });

                    await interaction.editReply(`Removed \`${entry.rss_source}\` from <#${entry.channel_id}>.`);
                })
                .catch(async (error) => {
                    console.error(error.message);
                    await interaction.editReply('An error occured');
                });

        } else {
            await interaction.reply({
                content: 'Sorry, only users with `Manage Webhooks` permission can do this!.',
                ephemeral: true,
            });
        }
    }

    if (interaction.options.getSubcommand() === 'list') {
        await interaction.deferReply();

        RSSEntry.find({ guild_id: interaction.guild.id })
            .then(async (callback) => {
                const recordFields = [];
                if (callback.length > 0) {
                    callback.forEach((item) => {
                        recordFields.push({
                            name: `ID: ${item._id}`,
                            value: `\`${item.rss_source}\` posted in <#${item.channel_id}>`,
                        });
                    });
                } else {
                    recordFields.push({
                        name: 'No RSS feeds',
                        value: 'Use the "/rss create" command to add RSS feeds to your guild.',
                    });
                }
                const embed = new EmbedBuilder()
                    .setTitle('RSS Feeds')
                    .setDescription('Configured RSS feeds for this guild. Events are posted via channel webhooks managed by the bot. Runs every 30 mins')
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL(),
                    })
                    .setFields(recordFields);
                await interaction.editReply({
                    embeds: [embed.data],
                });
            })
            .catch(async (error) => {
                console.error(error.message);
                await interaction.editReply('An error occured');
            });
    }
}

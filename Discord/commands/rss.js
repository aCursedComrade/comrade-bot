import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import RSSObj from '../../models/RSSObj.js';
import { getLatest } from '../../submodules/feedReader.js';

export const data = new SlashCommandBuilder()
    .setName('rss')
    .setDMPermission(false)
    .setDescription('RSS event management.')
    .addSubcommand((subcmd) =>
        subcmd
            .setName('create')
            .setDescription('Set up a RSS feed (RSS/Atom/JSON).')
            .addChannelOption((option) =>
                option.setName('channel').setDescription('Select the channel to post events.').setRequired(true),
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
        // create rss handler
        if (user.permissions.has('ManageWebhooks')) {
            await interaction.deferReply();
            const channel = interaction.options.getChannel('channel').id;
            const feed_url = interaction.options.getString('url').toString();
            try {
                const last_entry = await getLatest(feed_url);
                if (last_entry != undefined) {
                    const rss_record = new RSSObj({
                        guild_id: interaction.guild.id,
                        channel_id: channel,
                        rss_source: feed_url,
                        last_update: last_entry,
                    });
                    rss_record.save();
                    await interaction.editReply(
                        `Feed events from \`${feed_url}\` will be posted in <#${channel}> from now on. Make sure that I have permission to send messages in the specified channel.`,
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
    } else if (interaction.options.getSubcommand() === 'delete') {
        // delete rss handler
        if (user.permissions.has('ManageWebhooks')) {
            await interaction.deferReply();
            const rssId = interaction.options.getString('rss-id');

            RSSObj.findByIdAndDelete(rssId)
                .then(async (callback) => {
                    await interaction.editReply(`Removed \`${callback.rss_source}\` from <#${callback.channel_id}>.`);
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
    } else if (interaction.options.getSubcommand() === 'list') {
        // list rss handler
        await interaction.deferReply();
        RSSObj.find({ guild_id: interaction.guild.id })
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
                    .setDescription('Configured RSS feeds for this guild. All sources are looked up every 30 minutes.')
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL(),
                    })
                    .setFields(recordFields);
                await interaction.editReply({
                    content:
                        '**NOTE:** Make sure that I have permission to send messages in each specified channels, otherwise you will not see any feed data.',
                    embeds: [embed.data],
                });
            })
            .catch(async (error) => {
                console.error(error.message);
                await interaction.editReply('An error occured');
            });
    }
}

import { SlashCommandBuilder, EmbedBuilder, inlineCode } from 'discord.js';
import { DateTime } from 'luxon';
import RSSObj from '../models/RSSObj.js';
import logclass from '../logger.js';
const logger = new logclass();

export const data = new SlashCommandBuilder()
  .setName('rss-feed')
  .setDMPermission(false)
  .setDescription('RSS event management.')
  .addSubcommand(subcmd => subcmd
    .setName('create')
    .setDescription('Set up a RSS feed for the guild.')
    .addChannelOption(option => option
      .setName('channel')
      .setDescription('Select the channel to post events.')
      .setRequired(true))
    .addStringOption(option => option
      .setName('url')
      .setDescription('URL of the rss feed.')
      .setRequired(true)))
  .addSubcommand(subcmd => subcmd
    .setName('delete')
    .setDescription('Delete a configured RSS source.')
    .addStringOption(option => option
      .setName('rss-id')
      .setDescription('Use the "/rss-feed list" command to get the ID.')
      .setRequired(true)))
  .addSubcommand(subcmd => subcmd
    .setName('list')
    .setDescription('List all RSS feeds configured for the guild.'));

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  const user = await interaction.guild.members.fetch(interaction.user.id);
  if (interaction.options.getSubcommand() === 'create') {
    // create rss handler
    if (user.permissions.has('Administrator')) {
      await interaction.deferReply({ ephemeral: true });
      const channel = interaction.options.getChannel('channel').id;
      const feed_url = interaction.options.getString('url');
      try {
        const rss_record = new RSSObj({
          guild_id: interaction.guild.id,
          channel_id: channel,
          rss_source: feed_url,
          last_update: DateTime.now().toUTC().toISO(),
        });
        rss_record.save();
        await interaction.editReply(`Feed events from \`${feed_url}\` will be posted in <#${channel}> from now on.`);
      }
      catch (error) {
        console.error(error);
        interaction.editReply(`An error occured :: ${inlineCode(error.message)}`);
      }
    }
    else {
      await interaction.reply({ content: 'Sorry, only Administrators can do this!.', ephemeral: true });
    }
  }
  else if (interaction.options.getSubcommand() === 'delete') {
    // delete rss handler
    if (user.permissions.has('Administrator')) {
      await interaction.deferReply({ ephemeral: true });
      const rssId = interaction.options.getString('rss-id');
      RSSObj.findByIdAndDelete(rssId).exec((error, callback) => {
        if (error) {
          console.error(error);
          interaction.editReply(`An error occured :: ${inlineCode(error.message)}`);
        }
        else {
          interaction.editReply(`Removed ${inlineCode(callback.rss_source)} from <#${callback.channel_id}>.`);
        }
      });
    }
    else {
      await interaction.reply({ content: 'Sorry, only Administrators can do this!.', ephemeral: true });
    }
  }
  else {
    // list rss handler
    await interaction.deferReply({ ephemeral: true });
    RSSObj.find({ guild_id: interaction.guild.id }).exec((error, callback) => {
      if (error) {
        console.error(error);
        interaction.editReply(`An error occured :: ${inlineCode(error.message)}`);
      }
      else {
        const recordFields = [];
        callback.forEach(item => {
          // create a field for each item
          recordFields.push({ name: `ID: ${item._id}`, value: `${inlineCode(item.rss_source)} in <#${item.channel_id}>` });
        });
        const embed = new EmbedBuilder()
          .setTitle('RSS Feeds')
          .setDescription('Configured RSS feeds for this guild.')
          .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.icon })
          .setFields(recordFields);
        interaction.editReply({ embeds: [embed.data] });
      }
    });
  }
  logger.log(`/${data.name} command done`);
}

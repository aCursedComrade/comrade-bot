import { SlashCommandBuilder } from 'discord.js';
import logclass from '../logger.js';
const logger = new logclass();

// No persistence yet, resets every restart

export const data = new SlashCommandBuilder()
  .setName('rss-feed')
  .setDMPermission(false)
  .setDescription('Listens and post messages from rss events.')
  .addChannelOption(option => option
    .setName('channel')
    .setDescription('Select the channel to post events.')
    .setRequired(true))
  .addStringOption(option => option
    .setName('url')
    .setDescription('URL of the rss feed.')
    .setRequired(true));

export const feed_list = [];

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  const user = await interaction.guild.members.fetch(interaction.user.id);
  if (user.permissions.has('Administrator')) {
    const channel = interaction.options.getChannel('channel');
    const feed_url = interaction.options.getString('url');
    await interaction.reply(`Feed events from \`${feed_url}\` will be posted in ${channel} from now on.`);
    feed_list.push({ 'guild': `${interaction.guild.id}`, 'channel': `${channel.id}`, 'url': `${feed_url}` });
    // console.log(feed_list);
  }
  else {
    await interaction.reply({ content: 'Sorry, only Administrators can do this!. Contact an Administrator in the guild to add yours.', ephemeral: true });
  }
  logger.log(`/${data.name} command done`);
}

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('guildinfo')
  .setDMPermission(false)
  .setDescription('Retrieves information about the guild.');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  await interaction.deferReply({ ephemeral: false });
  await bot_client.guilds.fetch(interaction.guild.id)
    .then(async (guild) => {
      const roles = guild.roles.cache.map(role => role).toString().replace(/,/g, ' ');
      const emojis = guild.emojis.cache.map(emoji => emoji).toString().replace(/,/g, ' ') || '(No emojis)';
      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}`)
        .setColor(await guild.fetchOwner({ cache: true }).then(owner => owner.displayColor))
        .setThumbnail(guild.iconURL({ size: 4096 }))
        .addFields([
          { name: 'Server owner:', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Server created on:', value: `<t:${Math.floor(guild.createdAt / 1000)}:D>`, inline: true },
          { name: 'Member count:', value: `${guild.memberCount}`, inline: true },
          { name: 'Channel categories:', value: `${guild.channels.cache.filter(ch => !ch.isTextBased() && !ch.isVoiceBased()).size}`, inline: true },
          { name: 'Text channels:', value: `${guild.channels.cache.filter(ch => ch.isTextBased() && !ch.isVoiceBased() && !ch.isThread()).size}`, inline: true },
          { name: 'Voice channels:', value: `${guild.channels.cache.filter(ch => ch.isVoiceBased()).size}`, inline: true },
          { name: `Available Roles: (${guild.roles.cache.size})`, value: `${roles.length < 1024 ? roles : '(List exceeds field capacity)'}` },
          { name: `Emojis: (${guild.emojis.cache.size})`, value: `${emojis.length < 1024 ? emojis : '(List exceeds field capacity)'}` },
        ])
        .setImage(guild.bannerURL({ size: 4096 }))
        .setFooter({ text: `Guild ID: ${guild.id}` })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed.data] });
      logger.log(`/${data.name} command done`);
    })
    .catch(error => {
      logger.error(error);
      throw error;
    });
}

export default data;
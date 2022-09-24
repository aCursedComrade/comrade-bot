import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('guildinfo')
  .setDMPermission(false)
  .setDescription('Retrieves information about the guild');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  await interaction.deferReply();
  await bot_client.guilds.fetch(interaction.guild.id)
    .then(async (guild) => {
      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}`)
        .setColor(await guild.fetchOwner({ cache: true }).then((owner) => { return owner.displayColor; }))
        .setThumbnail(guild.iconURL({ size: 4096 }))
        .addFields([
          { name: 'Server owner:', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Server created on:', value: `<t:${Date.parse(guild.createdAt) / 1000}:D>`, inline: true },
          { name: 'Member count:', value: `${guild.memberCount}`, inline: true },
          { name: 'Channel categories:', value: `${guild.channels.cache.filter(ch => !ch.isTextBased() && !ch.isVoiceBased()).size}`, inline: true },
          { name: 'Text channels:', value: `${guild.channels.cache.filter(ch => ch.isTextBased() && !ch.isVoiceBased() && !ch.isThread()).size}`, inline: true },
          { name: 'Voice channels:', value: `${guild.channels.cache.filter(ch => ch.isVoiceBased()).size}`, inline: true },
          { name: `Available Roles: (${guild.roles.cache.size})`, value: `${guild.roles.cache.map((role) => { return role; })}` },
        ])
        .setImage(guild.bannerURL({ size: 4096 }))
        .setFooter({ text: `Guild ID: ${guild.id}` })
        .setTimestamp();
      interaction.editReply({ embeds: [embed.data] });
      logger.log(`/${data.name} command done`);
    })
    .catch(error => {
      logger.error(error);
      throw error;
    });
}

export default data;
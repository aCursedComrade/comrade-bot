import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDMPermission(false)
  .setDescription('Retrieves information about the user')
  .addUserOption(option => option
    .setName('user')
    .setDescription('Select a guild member. If not specified, returns the current user.')
    .setRequired(false));
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  await interaction.deferReply();
  const guildinfo = await bot_client.guilds.fetch(interaction.guild.id);
  await guildinfo.members.fetch(interaction?.options.getUser('user', false) || interaction.user.id)
    .then(async (member) => {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username}#${member.user.discriminator}` })
        .setColor(member.displayColor)
        .setThumbnail(member.displayAvatarURL({ size: 4096 }))
        .setDescription(`${member.user}`)
        .setFields([
          { name: 'Registered on:', value: `<t:${Date.parse(member.user.createdAt) / 1000}:D>`, inline: true },
          { name: 'Joined on:', value: `<t:${Date.parse(member.joinedAt) / 1000}:D>`, inline: true },
          { name: `Roles: (${member.roles.cache.size})`, value: `${member.roles.cache.map((role) => { return role; })}` },
          { name: 'Highest Role:', value: `${member.roles.highest}` },
          { name: 'Bot status:', value: `${member.user.bot}` },
        ])
        .setFooter({ text: `User ID: ${member.id}` })
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
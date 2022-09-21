import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Retrieves information about the user');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
  await interaction.deferReply();
  (await bot_client.guilds.fetch(interaction.guild.id)).members.fetch(interaction.user.id)
    .then(member => {
      // logger.log(JSON.stringify(member, null, '  '));
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username}#${member.user.discriminator}` })
        .setColor(member?.displayColor)
        .setThumbnail(member.displayAvatarURL({ size: 4096 }))
        .setDescription(`${member.user}`)
        .setFields([
          {
            name: 'Joined on:',
            value: `<t:${Date.parse(member.joinedAt) / 1000}:D>`,
          },
          {
            name: 'Registered on:',
            value: `<t:${Date.parse(member.user.createdAt) / 1000}:D>`,
          },
        ])
        .setFooter({ text: `User ID: ${member.id}` })
        .setTimestamp(Date.now());
      interaction.editReply({ embeds: [embed.data] });
      logger.log(`/${data.name} command done`);
    })
    .catch(error => {
      logger.error(error);
      throw error;
    });
}

export default data;
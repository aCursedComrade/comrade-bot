import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('guildinfo')
  .setDescription('Retrieves information about the guild');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
  await interaction.deferReply();
  await bot_client.guilds.fetch(interaction.guild.id)
    .then(guild => {
      // logger.log(JSON.stringify(guild, null, '  '));
      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}`)
        // .setColor(guild.fetchOwner({ force: true }).then(owner => { return owner.displayColor; }))
        .setThumbnail(guild.iconURL({ size: 4096 }))
        .setFields([
          {
            name: 'Server owner:',
            value: `<@${guild.ownerId}>`,
            inline: true,
          },
          {
            name: 'Server created on:',
            value: `<t:${Date.parse(guild.createdAt) / 1000}:D>`,
            inline: true,
          },
          {
            name: 'Member count:',
            value: `${guild.memberCount}`,
          },
          /*
          {
            name: 'Channels:',
            value: `${guild.client.channels.valueOf().map((channel) => { if (channel.isTextBased() || channel.isVoiceBased()) return channel; })}`,
          },
          */
          {
            name: 'Roles:',
            value: `${guild.roles.valueOf().map((role) => { return role; })}`,
          },
        ])
        .setImage(guild.bannerURL({ size: 4096 }))
        .setFooter({ text: `Guild ID: ${guild.id}` })
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
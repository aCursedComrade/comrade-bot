import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Retrieves guild member information');
export async function execute(interaction) {
  await interaction.deferReply();
  (await bot_client.guilds.fetch(interaction.guild.id)).members.fetch(interaction.user.id)
    .then(clientUser => {
      // logger.log(clientUser);
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${clientUser.user.username}#${clientUser.user.discriminator}` })
        .setThumbnail(clientUser.displayAvatarURL({ size: 4096 }))
        .setDescription(`${clientUser.user}`)
        .setFields([
          {
            name: 'Joined at:',
            value: `<t:${Date.parse(clientUser.joinedAt) / 1000}>`,
          },
        ])
        .setFooter({ text: `ID: ${clientUser.id}` })
        .setTimestamp(Date.now());
      interaction.editReply({ embeds: [embed.data] });
      logger.log(`/${data.name} command done`);
    })
    .catch(error => {
      logger.error(error);
      interaction.editReply('```json\n' + error + '```');
    });
}

export default data;
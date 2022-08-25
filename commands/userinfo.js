import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import bot_client from '../bot_client.js';

const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Retrieves guild member information');
export async function execute(interaction) {
  await interaction.deferReply();
  bot_client.users.fetch(interaction.user.id)
    .then(clientUser => {
      console.log(clientUser);
      const embed = new EmbedBuilder()
        .setAuthor({ name: clientUser.username })
        .setDescription(`<@${clientUser.id}>`);
      interaction.editReply({ content: 'Lole moment', embed: [embed.toJSON()] });
    })
    .catch(error => {
      console.log(error);
      interaction.editReply('```json\n' + error + '```');
    });
  console.log('/userinfo completed');
}

export default data;
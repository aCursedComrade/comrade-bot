import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');
export async function execute(interaction) {
  await interaction.reply('Pong!');
  console.log(`Completed '${interaction.commandName}' requested by ${interaction.user.tag}`);
}

export default data;
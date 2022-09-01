import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');
export async function execute(interaction) {
  await interaction.reply('Pong!');
  console.log(`/${data.name} command done`);
}

export default data;
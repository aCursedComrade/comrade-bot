import { SlashCommandBuilder } from 'discord.js';
import { get_reddit } from '../functions/get_reddit.js';

const data = new SlashCommandBuilder()
  .setName('reddit')
  .setDescription('Returns a random HOT meme from reddit');
export async function execute(interaction) {
  await interaction.deferReply();
  const url = await get_reddit();
  await interaction.editReply(`${url}`);
  console.log(`Completed '${interaction.commandName}' requested by ${interaction.user.tag}`);
}

export default data;
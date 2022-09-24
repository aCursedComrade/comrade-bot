import { SlashCommandBuilder } from 'discord.js';
import { get_reddit } from '../functions/get_reddit.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('reddit')
  .setDescription('Returns a random HOT meme from reddit');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  await interaction.deferReply();
  const url = await get_reddit();
  await interaction.editReply(`${url}`);
  logger.log(`/${data.name} command done`);
}

export default data;
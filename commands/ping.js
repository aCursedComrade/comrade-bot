import { SlashCommandBuilder } from 'discord.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');
export async function execute(interaction) {
  await interaction.reply('Pong!');
  logger.log(`/${data.name} command done`);
}

export default data;
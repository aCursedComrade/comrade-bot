import { SlashCommandBuilder } from 'discord.js';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  await interaction.reply('Pong! :ping_pong:');
  logger.log(`/${data.name} command done`);
}

export default data;
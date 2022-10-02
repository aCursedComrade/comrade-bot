import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import logger_func from '../logger.js';
const logger = new logger_func();

const data = new SlashCommandBuilder()
  .setName('lengthen')
  .setDescription('Lengthens a shortened URL')
  .addStringOption(option => option
    .setName('url')
    .setDescription('URL to lengthen')
    .setRequired(true));
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  const url = interaction.options.getString('url');
  const response = await axios.head(url);
  await interaction.reply(response.request.res.responseUrl);
  logger.log(`/${data.name} command done`);
}

export default data;
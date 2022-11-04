import { SlashCommandBuilder, userMention } from 'discord.js';
import logger_func from '../logger.js';
const logger = new logger_func();

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  const time = 1000 * 5;
  const funni = 'https://tenor.com/view/bonk-gif-19410756';
  await interaction.reply('Pong! :ping_pong: ...');
  logger.log(`/${data.name} command done`);
  setTimeout(() => {
    interaction.followUp({ content: `${userMention(interaction.user.id)} [BONK!](${funni})`, ephemeral: true });
  }, time);
}

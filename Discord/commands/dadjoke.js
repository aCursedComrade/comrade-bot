import { SlashCommandBuilder } from 'discord.js';
import get_dadjoke from '../../functions/get_dadjoke.js';

export const data = new SlashCommandBuilder()
  .setName('dadjoke')
  .setDescription('You wanna hear a dad joke?');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
  const joke = await get_dadjoke();
  await interaction.reply({ content: joke });
}

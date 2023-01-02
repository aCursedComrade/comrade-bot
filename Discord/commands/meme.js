import { SlashCommandBuilder } from 'discord.js';
import get_reddit from '../../functions/get_reddit.js';

export const data = new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Returns a random HOT meme from reddit (May not be funny).');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    await interaction.deferReply();
    const url = await get_reddit();
    await interaction.editReply(`${url}`);
    // console.log(`/${data.name} command done`);
}

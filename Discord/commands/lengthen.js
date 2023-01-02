import { SlashCommandBuilder } from 'discord.js';
import { lengthen } from '../../functions/multi.js';

export const data = new SlashCommandBuilder()
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
    await interaction.deferReply();
    const url = interaction.options.getString('url');
    const head = await lengthen(url);
    await interaction.editReply({ content: head });
    // console.log(`/${data.name} command done`);
}

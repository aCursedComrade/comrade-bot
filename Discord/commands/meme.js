import { SlashCommandBuilder } from 'discord.js';
import { get_reddit } from '../../functions/reddit.js';
import { EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('meme').setDescription('Hot meme from r/dankmemes');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    await interaction.deferReply();
    const meme = await get_reddit();
    if (meme) {
        const memepayload = new EmbedBuilder()
            .setTitle(meme.title)
            .setURL(`https://www.reddit.com${meme.permalink}`)
            .setImage(meme.url)
            .setFooter({ text: meme.subreddit_name_prefixed });
        await interaction.followUp({ embeds: [memepayload.data] });
    } else {
        await interaction.editReply('Issue reaching to API. Try again later.');
    }
}

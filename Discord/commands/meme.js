import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import axios from 'axios';

export const data = new SlashCommandBuilder().setName('meme').setDescription('Hot meme from the internet');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    await interaction.deferReply();
    await axios
        .get('https://meme-api.com/gimme', {
            headers: { 'User-Agent': 'Comrade-Bot https://github.com/aCursedComrade/Comrade-Bot' },
        })
        .then(async (res) => {
            const message = new EmbedBuilder()
                .setTitle(res.data.title)
                .setURL(res.data.postLink)
                .setImage(res.data.url)
                .setFooter({ text: `r/${res.data.subreddit}` });

            await interaction.followUp({ embeds: [message.toJSON()] });
        })
        .catch(async (err) => {
            console.error(err.message);
            await interaction.editReply('Issue reaching to API. Try again later.');
        });
}

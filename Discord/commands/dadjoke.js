import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

async function get_dadjoke() {
    const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: {
            'User-Agent': 'Comrade-Bot https://github.com/aCursedComrade/Comrade-Bot',
            Accept: 'application/json',
        },
    });

    return response.data?.joke ? response.data.joke : 'Something went wrong. Try again?';
}

export const data = new SlashCommandBuilder().setName('dadjoke').setDescription('You wanna hear a dad joke?');
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    const joke = await get_dadjoke();
    await interaction.reply({ content: joke });
}

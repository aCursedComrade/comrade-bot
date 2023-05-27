import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

async function get_dadjoke() {
    let out = '';
    const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Comrade Bot (https://github.com/aCursedComrade/Comrade-Bot)',
        },
    });

    response.data?.joke ? out = response.data.joke : out = 'Something went wrong :(\nTry again?';
    return out;
}

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

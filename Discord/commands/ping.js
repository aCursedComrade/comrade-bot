import { SlashCommandBuilder } from 'discord.js';

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
    // console.log(`/${data.name} command done`);
    setTimeout(() => {
        interaction.followUp({ content: `<@${interaction.user.id}> [BONK!](${funni})`, ephemeral: true });
    }, time);
}

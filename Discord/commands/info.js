import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import client from '../client.js';

export const data = new SlashCommandBuilder().setName('info').setDescription('Display information about the bot');

function uptime() {
    const up = Math.floor(process.uptime());

    const d = Math.floor(up / 3600 / 24);
    const h = Math.floor((up / 3600) % 24);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor((up % 3600) % 60);

    return `${d} days ${h} hours ${m} minutes ${s} seconds`;
}

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    const embed = new EmbedBuilder()
        .setTitle(client.user.username)
        .setThumbnail(client.user.displayAvatarURL({ size: 4096 }))
        .setDescription('Made by [aCursed_Comrade#8655](https://acursedcomrade.github.io/about/) because he was bored.')
        .setFields([
            { name: 'Source:', value: '[Github](https://github.com/aCursedComrade/Comrade-Bot)' },
            { name: 'Total Servers:', value: client.guilds.cache.size.toString() },
            { name: 'Uptime:', value: uptime() },
            { name: 'Ping:', value: `${client.ws.ping} ms` },
        ])
        .setFooter({ text: `Client ID: ${client.user.id}` })
        .setTimestamp();
    interaction.reply({ embeds: [embed.data], ephemeral: true });
}

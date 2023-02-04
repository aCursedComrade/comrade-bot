import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('userinfo')
    .setDMPermission(false)
    .setDescription('Display information about the user.')
    .addUserOption(option => option
        .setName('user')
        .setDescription('Select a guild member. If not specified, returns the current user.')
        .setRequired(false));
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function handler(interaction) {
    // await interaction.deferReply({ ephemeral: true });
    await interaction.guild.members.fetch(interaction?.options.getUser('user', false) || interaction.user.id)
        .then(async (member) => {
            const roles = member.roles.cache.map(role => role).toString().replace(/,/g, ' ') || '(User has no roles)';
            const embed = new EmbedBuilder()
                .setTitle(member.user.tag)
                .setColor(member.displayColor)
                .setThumbnail(member.displayAvatarURL({ size: 4096 }))
                .setDescription(`${member.user}`)
                .setFields([
                    { name: 'Registered on:', value: `<t:${Math.floor(member.user.createdAt.valueOf() / 1000)}:D>`, inline: true },
                    { name: 'Joined on:', value: `<t:${Math.floor(member.joinedAt.valueOf() / 1000)}:D>`, inline: true },
                    { name: `Roles: (${member.roles.cache.size})`, value: `${roles.length < 1024 ? roles : '(List exceeds field capacity)'}` },
                    { name: 'Highest Role:', value: `${member.roles.highest}` },
                    { name: 'Is a bot?', value: `${member.user.bot}` },
                ])
                .setFooter({ text: `User ID: ${member.id}` })
                .setTimestamp();
            interaction.reply({ embeds: [embed.data], ephemeral: true });
            // console.log(`/${data.name} command done`);
        });
}

const { SlashCommandBuilder } = require('discord.js');
const { get_reddit } = require('../functions/get_reddit.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reddit')
    .setDescription('Returns a random HOT meme from reddit'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = await get_reddit();
    await interaction.editReply(`${url}`);
    console.log(`Completed '${interaction.commandName}' requested by ${interaction.user.tag}`);
  },
};
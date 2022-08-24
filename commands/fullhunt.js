const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const { fullhunt } = require('../functions/get_fullhunt.js');

// Relative to main.js
const outFile = './fullhunt.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fullhunt')
    .setDescription('Interact with FullHunt API to discover attack surfaces')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Select what kind of query to make')
        .setRequired(true)
        .addChoices(
          { name:'Query domain info', value: 'domain' },
          { name:'Query subdomains of a domain', value:'subdomains' },
          { name:'Query host info', value:'host' },
        ))
    .addStringOption(option =>
      option
        .setName('host')
        .setDescription('Ex: example.com')
        .setRequired(true)),
  async execute(interaction) {
    console.log(`${JSON.stringify(interaction.options)}`);
    await interaction.deferReply();
    const method = interaction.options.getString('query');
    const target = interaction.options.getString('host');
    const fh_data = JSON.stringify(await fullhunt(method, target), null, '  ');
    fs.writeFile(outFile, fh_data, (err) => { if (err) console.error(err); });
    const file = new AttachmentBuilder(outFile);
    await interaction.editReply({
      files: [file],
    });
    fs.unlink(outFile, (err) => { if (err) console.error(err); });
    console.log(`Completed '${interaction.commandName}' requested by ${interaction.user.tag}`);
  },
};
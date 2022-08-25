import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { writeFile, unlink } from 'fs';
import { get_fullhunt } from '../functions/get_fullhunt.js';

// Relative to main.js
const outFile = './fullhunt.json';

const data = new SlashCommandBuilder()
  .setName('fullhunt')
  .setDescription('Interact with FullHunt API to discover attack surfaces')
  .addStringOption(option => option
    .setName('query')
    .setDescription('Select what kind of query to make')
    .setRequired(true)
    .addChoices(
      { name: 'Query domain info', value: 'domain' },
      { name: 'Query subdomains of a domain', value: 'subdomains' },
      { name: 'Query host info', value: 'host' },
    ))
  .addStringOption(option => option
    .setName('host')
    .setDescription('Ex: example.com')
    .setRequired(true));
export async function execute(interaction) {
  await interaction.deferReply();
  const method = interaction.options.getString('query');
  const target = interaction.options.getString('host');
  const fh_data = JSON.stringify(await get_fullhunt(method, target), null, '  ');
  writeFile(outFile, fh_data, (error) => {
    if (error) {console.error(error);}
  });
  const file = new AttachmentBuilder(outFile);
  await interaction.editReply({
    files: [file],
  });
  unlink(outFile, (error) => {
    if (error) {console.error(error);}
  });
  console.log(`Completed '${interaction.commandName}' requested by ${interaction.user.tag}`);
}

export default data;
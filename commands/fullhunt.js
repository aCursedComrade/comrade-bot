import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { get_fullhunt } from '../functions/get_fullhunt.js';
import logger_func from '../logger.js';
const logger = new logger_func();

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
  const file_buf = Buffer.from(fh_data, 'latin1');
  const file = new AttachmentBuilder(file_buf, { name: 'fullhunt.json' });
  await interaction.editReply({
    files: [file],
  });
  logger.log(`/${data.name} command done`);
}

export default data;
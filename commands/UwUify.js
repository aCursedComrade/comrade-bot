import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import Uwuifier from 'uwuifier';
// import axios from 'axios';
import logger_func from '../logger.js';
const logger = new logger_func();

// why did i make this

export const data = new ContextMenuCommandBuilder()
  .setName('UwUify')
  .setType(ApplicationCommandType.Message);
/**
 * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction
 */
export async function handler(interaction) {
  await interaction.deferReply();
  const uwu = new Uwuifier();
  const sacred_text = uwu.uwuifySentence(interaction.targetMessage.content);
  await interaction.editReply({ content: sacred_text });
  // const uwuapi = `https://uwuify.helba.ai/?uwu=${interaction.targetMessage.content}`;
  /*
  await axios.get(uwuapi)
    .then(async (res) => {
      await interaction.editReply({ content: `${res.data}` });
    });
  */
  logger.log(`/${data.name} command done`);
}

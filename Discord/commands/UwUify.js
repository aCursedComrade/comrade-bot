import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import Uwuifier from 'uwuifier';

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
  // console.log(`/${data.name} command done`);
}

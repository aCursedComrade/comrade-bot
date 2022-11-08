import { Collection, codeBlock } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import bot_client from './client.js';
import logclass from './logger.js';
import init_modules from './submodules/init.js';
import 'dotenv/config';

const logger = new logclass();
init_modules();

// Dynamically loading commands
const commandset = new Collection();
const cmdPath = join('commands');
const cmdFiles = readdirSync(cmdPath).filter(file => file.endsWith('.js'));
(async () => {
  try {
    for (const file of cmdFiles) {
      const filePath = join(cmdPath, file);
      const { data, handler } = await import(`./${filePath}`);
      commandset.set(data.name, handler);
    }
    logger.log('Successfully loaded all commands.');
  }
  catch (error) {
    logger.error(error.message);
  }
})();

// Event Handlers
bot_client.on('interactionCreate', async (interaction) => {
  const handler = commandset.get(interaction.commandName);
  try {
    await handler(interaction);
  }
  catch (error) {
    logger.error(error.message);
    // console.error(error);
    if (interaction.deferred) {
      await interaction.editReply({ content: `Bot ran into a problem :pensive: ${codeBlock(error.message)}` });
    }
    else {
      await interaction.reply({ content: `Bot ran into a problem :pensive: ${codeBlock(error.message)}` });
    }
  }
});

bot_client.once('ready', () => {
  logger.log(`Logged in as ${bot_client.user.tag}!`);
});

bot_client.login(process.env.TOKEN);

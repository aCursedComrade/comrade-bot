import { Collection, codeBlock } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import bot_client from './bot_client.js';
import server from './server.js';
import logger_func from './logger.js';
import 'dotenv/config';
const logger = new logger_func();
server();

// Dynamically loading commands
const commandset = new Collection();
const cmdPath = join('commands');
const cmdFiles = readdirSync(cmdPath).filter(file => file.endsWith('.js'));
(async () => {
  try {
    for (const file of cmdFiles) {
      const filePath = join(cmdPath, file);
      const { default: cmd_data, handler } = await import(`./${filePath}`);
      commandset.set(cmd_data.name, handler);
    }
    logger.log('Successfully loaded all commands.');
  }
  catch (error) {
    logger.error(error);
  }
})();

// Command handler
bot_client.on('interactionCreate', async (interaction) => {
  const handler = commandset.get(interaction.commandName);
  try {
    await handler(interaction);
  }
  catch (error) {
    logger.error(error);
    if (interaction.deferred) {
      await interaction.editReply({ content: `Bot ran into a problem :pensive: ${codeBlock(error)}` });
    }
    else {
      await interaction.reply({ content: `Bot ran into a problem :pensive: ${codeBlock(error)}` });
    }
  }
});

bot_client.on('ready', () => {
  logger.log(`Logged in as ${bot_client.user.tag}!`);
});

bot_client.login(process.env.TOKEN);
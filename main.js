import { Collection } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import bot_client from './bot_client.js';
import server from './server.js';
import 'dotenv/config';
server();

// Dynamically calling commands
bot_client.commands = new Collection();
const cmdPath = join('commands');
const cmdFiles = readdirSync(cmdPath).filter(file => file.endsWith('.js'));

(async () => {
  try {
    for (const file of cmdFiles) {
      const filePath = join(cmdPath, file);
      const { default: cmd_data, execute } = await import(`./${filePath}`);
      bot_client.commands.set(cmd_data.name, execute);
    }
    console.log('Successfully loaded all commands.');
  }
  catch (error) {
    console.error(error);
  }
})();

// Command handlers
bot_client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = bot_client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command(interaction);
  }
  catch (error) {
    console.error(error);
    if (interaction.deferred) {
      await interaction.editReply({ content: 'Bot ran into a problem :pensive: ```json\n' + error + '```' });
    }
    else {
      await interaction.reply({ content: 'Bot ran into a problem :pensive: ```json\n' + error + '```' });
    }
  }
});

bot_client.on('ready', () => {
  console.log(`Logged in as ${bot_client.user.tag}!`);
});

bot_client.login(process.env.TOKEN);
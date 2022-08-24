const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Dynamically calling commands
client.commands = new Collection();
const cmdPath = path.join(__dirname, 'commands');
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
for (const file of cmdFiles) {
  const filePath = path.join(cmdPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Command handlers
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    if (interaction.deferred) {
      await interaction.editReply('Bot ran into a problem :pensive:');
    }
    else {
      await interaction.reply('Bot ran into a problem :pensive:');
    }
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN);
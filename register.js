const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

const commands = [];
const cmdPath = path.join(__dirname, 'commands');
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
  const filePath = path.join(cmdPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Successfully reloaded GLOBAL application (/) commands.');
    // await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD), { body: testing });
    // console.log('Successfully reloaded TESTING application (/) commands.');
  }
  catch (error) {
    console.error(error);
  }
})();
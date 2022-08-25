import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [];
const cmdPath = join('commands');
const cmdFiles = readdirSync(cmdPath).filter(file => file.endsWith('.js'));

(async () => {
  try {
    for (const file of cmdFiles) {
      const filePath = join(cmdPath, file);
      const { default: cmd_data } = await import(`./${filePath}`);
      commands.push(cmd_data);
    }

    // console.log(commands);
    await rest.put(Routes.applicationCommands(process.env.ID), { body: commands });
    console.log('Successfully reloaded GLOBAL application (/) commands.');
    // await rest.put(Routes.applicationGuildCommands(process.env.ID, process.env.TEST_GUILD), { body: testing });
    // console.log('Successfully reloaded TESTING application (/) commands.');
  }
  catch (error) {
    console.error(error);
  }
})();
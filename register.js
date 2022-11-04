import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config';
import logger_func from './logger.js';
const logger = new logger_func();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [];
const cmdPath = join('commands');
const cmdFiles = readdirSync(cmdPath).filter(file => file.endsWith('.js'));

(async () => {
  try {
    for (const file of cmdFiles) {
      const filePath = join(cmdPath, file);
      const { data } = await import(`./${filePath}`);
      commands.push(data);
    }

    // logger.log(commands);
    await rest.put(Routes.applicationCommands(process.env.ID), { body: commands });
    logger.log('Successfully reloaded GLOBAL application (/) commands.');
    // await rest.put(Routes.applicationGuildCommands(process.env.ID, process.env.TEST_GUILD), { body: testing });
    // logger.log('Successfully reloaded TESTING application (/) commands.');
  }
  catch (error) {
    logger.error(error);
  }
})();
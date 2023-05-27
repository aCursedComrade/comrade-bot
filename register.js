import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [];
const cmdPath = `${process.cwd()}/Discord/commands/`;
const cmdFiles = readdirSync(cmdPath).filter(file => file.endsWith('.js'));

(async () => {
    try {
        for (const file of cmdFiles) {
            const { data } = await import(`${cmdPath + file}`);
            commands.push(data);
        }

        // console.log(commands);
        await rest.put(Routes.applicationCommands(process.env.ID), { body: commands });
        console.log('Successfully reloaded GLOBAL Discord application commands.');
    }
    catch (error) {
        console.error(error.message);
    }
})();

import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config';

const commands = [];
const rest = new REST().setToken(process.env.TOKEN);
const cmdPath = join(process.cwd(), 'Discord/commands');
const cmdFiles = readdirSync(cmdPath).filter((file) => file.endsWith('.js'));

try {
    for (const file of cmdFiles) {
        console.log(file);
        const { data } = await import(join('file://', cmdPath, file));
        commands.push(data);
    }

    await rest.put(Routes.applicationCommands(process.env.ID), { body: commands });
    console.log('Successfully reloaded GLOBAL Discord application commands.');
} catch (error) {
    console.error(error);
}

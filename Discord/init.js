import { Collection, codeBlock, InteractionType } from 'discord.js';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import client from './client.js';
import 'dotenv/config';

const commandset = new Collection();

// entry point
async function init() {
    const cmdPath = join(process.cwd(), 'Discord/commands');
    const cmdFiles = readdirSync(cmdPath).filter((file) => file.endsWith('.js'));

    for (const file of cmdFiles) {
        const command = await import(pathToFileURL(join(cmdPath, file)).toString());
        if ('data' in command && 'handler' in command) {
            commandset.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${join(cmdPath, file)} is missing a required "data" or "handler" property.`,
            );
        }
    }

    // start
    client.login(process.env.TOKEN);
}

// Event Handlers
client.on('interactionCreate', async (interaction) => {
    if (interaction.type == InteractionType.ApplicationCommand) {
        const command = commandset.get(interaction.commandName);

        if (!command) {
            console.error(`No handler exists for ${interaction.commandName}`);
            return;
        }

        try {
            await command.handler(interaction);
        } catch (error) {
            console.error(`${interaction.commandName} failed: ${error.message}`);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: `Bot ran into a problem :pensive: ${codeBlock(error.message)}` });
            } else {
                await interaction.reply({ content: `Bot ran into a problem :pensive: ${codeBlock(error.message)}` });
            }
        }
    } else {
        return;
    }
});

client.on('ready', () => {
    console.log(`Discord: Logged in as ${client.user.tag}`);
});

export default init;

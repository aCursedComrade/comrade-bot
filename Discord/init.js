import { Collection, InteractionType } from 'discord.js';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import client from './client.js';

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
            console.error(`The command at ${join(cmdPath, file)} is missing a required "data" or "handler" property.`);
        }
    }

    client.login(process.env.TOKEN);
}

// event Handlers
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
                await interaction.followUp({ content: 'Sorry! Bot ran into a problem :pensive:' });
            } else {
                await interaction.reply({ content: 'Sorry! Bot ran into a problem :pensive:' });
            }
        }
    }
});

client.on('error', async (error) => {
    console.error(`Client error: ${error.message}`);
});

client.on('ready', () => {
    console.log(`Init: Logged in as ${client.user.tag}`);
});

export default init;

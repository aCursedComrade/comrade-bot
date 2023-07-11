import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
});

export default client;

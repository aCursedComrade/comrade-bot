import { Client, GatewayIntentBits } from 'discord.js';
const discord_client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
  ],
});

export default discord_client;

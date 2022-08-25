import { Client, GatewayIntentBits } from 'discord.js';
const bot_client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
  ],
});

export default bot_client;
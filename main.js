import server from './submodules/server.js';
import init_mongoDB from './submodules/mongoDB.js';
import feedReader from './submodules/feed-parser.js';
import init_Discord from './Discord/init_Discord.js';
import init_Telegram from './Telegram/init_Telegram.js';

// Invoke all application modules
(() => {
    init_Discord();
    init_Telegram();
    // sub-modules
    server();
    init_mongoDB();
    feedReader();
})();

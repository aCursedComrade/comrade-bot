import mongo from './submodules/mongoDB.js';
import feedReader from './submodules/feedReader.js';
import init from './Discord/init.js';

(async () => {
    if (!process.env.NODE_ENV) { await import('dotenv/config'); }
    mongo();
    feedReader();
    init();
})();

import mongo from './submodules/mongoDB.js';
import feedReader from './submodules/feedReader.js';
import init from './Discord/init.js';
import('dotenv/config');

(async () => {
    mongo();
    feedReader();
    init();
})();

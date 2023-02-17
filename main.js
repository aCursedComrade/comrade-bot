import server from './submodules/server.js';
import init_mongoDB from './submodules/mongoDB.js';
import feedReader from './submodules/feedReader.js';
import init from './Discord/init.js';

// Invoke all application modules
(() => {
    init();
    // sub-modules
    server();
    init_mongoDB();
    feedReader();
})();

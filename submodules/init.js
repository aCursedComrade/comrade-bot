import server from './server.js';
import { feedReader } from './feed-parser.js';
import { init_mongoDB } from './mongoDB.js';

// Invoke all submodules when called from 'main'
async function init_modules() {
  server();
  init_mongoDB();
  feedReader();
}

export default init_modules;

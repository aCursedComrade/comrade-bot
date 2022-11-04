import { feedReader } from './functions/feed_parser.js';

// Invoke all submodules when called from 'main'
async function init_modules() {
  feedReader();
}

export default init_modules;

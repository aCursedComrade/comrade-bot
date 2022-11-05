import { read } from 'feed-reader';
import bot_client from '../client.js';
import logclass from '../logger.js';
import RSSObj from '../models/RSSObj.js';

const logger = new logclass();

export async function feedReader() {
  setInterval(() => {
    try {
      RSSObj.find().exec((error, feed_list) => {
        if (error) throw error;
        feed_list.forEach(item => {
          read(item['rss_source'], {
            descriptionMaxLen: 400,
          }).then(result => {
            const channel = bot_client.channels.cache.get(item.channel_id);
            channel.send(result.title);
            console.log(result);
          });
        });
      });
    }
    catch (error) {
      logger.error('Feed Parser: ' + error.message);
    }
    logger.log('Feed Parser: Job done.');
  }, 1000 * 30);
}

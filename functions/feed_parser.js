import { read } from 'feed-reader';
import { feed_list } from '../commands/rss-feed.js';

/*
const feed_list = [
  { 'name': 'Hacker News', 'url': 'https://feeds.feedburner.com/TheHackersNews?format=xml' },
  { 'name': 'Google News', 'url': 'https://news.google.com/atom' },
];
*/

export async function feedReader() {
  setInterval(() => {
    // console.log(feed_list);
    feed_list.forEach(item => {
      read(item['url'], {
        descriptionMaxLen: 1000,
      }).then(result => console.log(result.title));
    });
  }, 1000 * 10);
}

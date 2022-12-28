import axios from 'axios';
import { randomObj } from './multi.js';

/**
 * @returns {Promise<String>} Meme URL
 */
async function get_reddit() {
  const subs = ['memes', 'meme', 'dankmemes', 'Animemes', 'Funnymemes'];
  const response = await axios.get(`https://www.reddit.com/r/${subs[randomObj(subs)]}/hot.json`, {
    params: {
      g: 'GLOBAL',
      show: 'all',
    },
  });
  const posts = response.data.data.children
    .map((post) => {
      if (post.data.domain) {
        return post.data.url;
      }
    })
    .filter((post) => !!post);
  return posts[randomObj(posts)];
}

export default get_reddit;

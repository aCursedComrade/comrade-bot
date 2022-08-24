const axios = require('axios').default;
require('dotenv').config();

function random_ary(object) {
  return Math.floor(Math.random() * object.length);
}

module.exports = {
  data: null,
  async get_reddit() {
    try {
      const subs = ['memes', 'meme', 'dankmemes'];
      const response = await axios.get(`https://www.reddit.com/r/${subs[random_ary(subs)]}/hot.json`, {
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
          else {
            return null;
          }
        })
        .filter((post) => !!post);
      return posts[random_ary(posts)];
    }
    catch (error) {
      console.error(error);
    }
  },
};
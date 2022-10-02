import axios from 'axios';

function random_ary(object) {
  return Math.floor(Math.random() * object.length);
}

export async function get_reddit() {
  const subs = ['memes', 'meme', 'dankmemes', 'Animemes'];
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